import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCoinData } from '../utils/reduxStorage';
import { priceDataUrl } from '../utils/urls';

const PRICE_INTERVAL = 5000;

const useMarketActivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(priceDataUrl);
        const jsonData = response.data;
        const priceList = jsonData.map((coin) => {
          return {
            symbol: coin.symbol,
            price: coin.price,
            volume: coin.volume,
            change: coin.change,
            logo: coin.logo,
            isTradFi: coin.isTradFi,
          };
        });
        dispatch(setCoinData(priceList));
      } catch (error) {
        console.error('Error fetching market prices:', error);
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, PRICE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export default useMarketActivity;
