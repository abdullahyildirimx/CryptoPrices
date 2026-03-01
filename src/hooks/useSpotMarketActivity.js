import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSpotMarketActivity } from '../utils/reduxStorage';
import { spotMarketActivityUrl } from '../utils/urls';

const useSpotMarketActivity = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMarketActivity = async () => {
      try {
        const response = await axios.get(spotMarketActivityUrl);
        const jsonData = response.data;
        const activityList = jsonData.map((coin) => {
          const symbol = coin.symbol;
          const oldPrice = coin.oldPrice;
          const newPrice = coin.newPrice;
          const change = coin.change;
          const time = new Date(coin.time).toLocaleTimeString();

          return {
            symbol: symbol,
            oldPrice: oldPrice,
            newPrice: newPrice,
            change: change,
            time: time,
          };
        });
        dispatch(setSpotMarketActivity(activityList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarketActivity();
    const intervalId = setInterval(fetchMarketActivity, 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export default useSpotMarketActivity;
