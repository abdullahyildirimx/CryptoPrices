import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCoinData } from '../utils/reduxStorage';
import { priceDataUrl } from '../utils/urls';

const useMarketActivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(priceDataUrl);
        const jsonData = response.data;
        const priceList = jsonData.map((coin) => {
          const symbol = coin.symbol;
          const price = coin.price;
          const volume = coin.volume;
          const change = coin.change;
          const logo = coin.logo;
          const isTradFi = coin.isTradFi;

          return {
            symbol: symbol,
            price: price,
            volume: volume,
            change: change,
            logo: logo,
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
  }, [dispatch]);
};

export default useMarketActivity;
