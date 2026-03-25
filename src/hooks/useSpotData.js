import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSpotCoinData, setSpotCoinMetadata } from '../utils/reduxStorage';
import { spotPriceUrl, spotExchangeInfoUrl, coinLogosUrl } from '../utils/urls';

const useSpotData = (enabled) => {
  const { spotCoinMetadata } = useSelector((state) => state.dataStore);
  const [coinMetadata, setCoinMetadata] = useState(spotCoinMetadata || null);
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
    if (!enabled) return;

    const fetchPriceData = async () => {
      try {
        const response = await axios.get(spotPriceUrl);
        const jsonData = response.data;

        const filteredCoins = jsonData.filter((coin) => {
          return (
            (coin.symbol.endsWith('USDT') || coin.symbol === 'USDTTRY') &&
            coin.bidPrice !== '0.00000000'
          );
        });

        const priceList = filteredCoins.map((coin) => {
          let symbol = coin.symbol;
          let price = coin.lastPrice;
          let volume = coin.quoteVolume;
          const change = coin.priceChangePercent;
          let currency = '$';
          let logo = null;
          let tickSize = null;

          if (symbol !== 'USDTTRY') {
            symbol = symbol.slice(0, -'USDT'.length);
          } else {
            symbol = symbol.slice(0, -'TRY'.length);
            volume = coin.volume;
            currency = '₺';
          }

          if (coinMetadata) {
            let metadata = coinMetadata.find((coin) => coin.symbol === symbol);
            if (metadata) {
              const tickSizeDecimals = metadata.tickSize;
              price = parseFloat(price).toFixed(tickSizeDecimals);
              logo = metadata.logo;
              tickSize = metadata.tickSize;
            }
          } else {
            price = parseFloat(price);
          }

          return {
            symbol: symbol,
            price: price,
            volume: volume,
            change: change,
            currency: currency,
            logo: logo,
            tickSize: tickSize,
          };
        });
        dispatch(setSpotCoinData(priceList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, 5000);
    return () => clearInterval(intervalId);
  }, [coinMetadata, enabled, dispatch]);

  useEffect(() => {
    if (!enabled || spotCoinMetadata) return;

    const fetchCoinMetadata = async () => {
      try {
        const response = await axios.get(spotExchangeInfoUrl);
        const jsonData = response.data;

        const response2 = await axios.get(coinLogosUrl);
        const logoData = response2.data?.data;

        const filteredCoins = jsonData.symbols.filter((coin) => {
          return (
            (coin.symbol.endsWith('USDT') || coin.symbol === 'USDTTRY') &&
            coin.status === 'TRADING'
          );
        });
        const coinMetadata = filteredCoins
          .map((item) => {
            let symbol = item.symbol;
            let tickSize = countDecimalPlaces(item.filters[0].tickSize);
            let logo;

            if (symbol !== 'USDTTRY') {
              symbol = symbol.slice(0, -'USDT'.length);
            } else {
              symbol = symbol.slice(0, -'TRY'.length);
            }

            if (symbol !== 'EUR') {
              logo = logoData.find((coin) => coin?.asset === symbol)?.logo;
            } else {
              logo = logoData.find((coin) => coin?.asset === 'EURI')?.logo;
            }

            return {
              symbol: symbol,
              tickSize: tickSize,
              logo: logo,
            };
          })
          .slice()
          .sort((a, b) => {
            return a.symbol.localeCompare(b.symbol);
          });

        setCoinMetadata(coinMetadata);
        dispatch(setSpotCoinMetadata(coinMetadata));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoinMetadata();
  }, [spotCoinMetadata, enabled, dispatch]);
};

export default useSpotData;
