import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCoinData } from '../utils/reduxStorage';
import { priceUrl, exchangeInfoUrl, coinLogosUrl } from '../utils/urls';

const usePriceData = () => {
  const [coinMetadata, setCoinMetadata] = useState(null);
  const dispatch = useDispatch();

  const countDecimalPlaces = (num) => {
    let reduced = parseFloat(num);
    if (parseFloat(num) >= 1) {
      return 0;
    }
    reduced = reduced.toString();
    if (reduced === '1e-7') {
      return 7;
    }
    if (reduced === '1e-8') {
      return 8;
    }
    return reduced.split('.')[1].length;
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      let metadata = coinMetadata;
      if (!metadata) {
        try {
          const response = await axios.get(exchangeInfoUrl);
          const jsonData = response.data;

          const response2 = await axios.get(coinLogosUrl);
          const logoData = response2.data?.data;

          const filteredCoins = jsonData.symbols.filter((coin) => {
            return coin.symbol.endsWith('USDT') && coin.status === 'TRADING';
          });

          const coinMetadata = filteredCoins
            .map((item) => {
              const symbol = item.symbol.slice(0, -'USDT'.length);
              const tickSize = countDecimalPlaces(item.filters[0].tickSize);
              const isTradFi = item.contractType === 'TRADIFI_PERPETUAL';
              const logo = logoData.find(
                (coin) => coin?.asset === symbol,
              )?.logo;

              return {
                symbol: symbol,
                tickSize: tickSize,
                isTradFi: isTradFi,
                logo: logo,
              };
            })
            .slice()
            .sort((a, b) => {
              return a.symbol.localeCompare(b.symbol);
            });

          setCoinMetadata(coinMetadata);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

      try {
        const response = await fetch(priceUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const currentTime = Date.now();
        const filteredCoins = jsonData.filter((coin) => {
          return (
            coin.symbol.endsWith('USDT') &&
            currentTime <= coin.closeTime + 1800000
          );
        });

        const priceList = filteredCoins.map((coin) => {
          const symbol = coin.symbol.slice(0, -'USDT'.length);
          let price = coin.lastPrice;
          const volume = coin.quoteVolume;
          const change = coin.priceChangePercent;
          let logo = null;
          let tickSize = null;
          let isTradFi = null;

          if (coinMetadata) {
            let metadata = coinMetadata.find((coin) => coin.symbol === symbol);
            if (metadata) {
              const tickSizeDecimals = metadata.tickSize;
              price = parseFloat(price).toFixed(tickSizeDecimals);
              logo = metadata.logo;
              tickSize = metadata.tickSize;
              isTradFi = metadata.isTradFi;
            }
          } else {
            price = parseFloat(price);
          }

          return {
            symbol: symbol,
            price: price,
            volume: volume,
            change: change,
            logo: logo,
            tickSize: tickSize,
            isTradFi: isTradFi,
          };
        });
        dispatch(setCoinData(priceList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, 5000);
    return () => clearInterval(intervalId);
  }, [coinMetadata, dispatch]);
};

export default usePriceData;
