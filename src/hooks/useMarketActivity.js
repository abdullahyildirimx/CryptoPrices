import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setMarketActivity } from '../utils/reduxStorage';
import { marketActivityUrl } from '../utils/urls';

const ACTIVITY_INTERVAL = 10000;

const useMarketActivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMarketActivity = async () => {
      try {
        const response = await axios.get(marketActivityUrl);
        const jsonData = response.data;
        const activityList = jsonData.map((coin) => {
          return {
            symbol: coin.symbol,
            oldPrice: coin.oldPrice,
            newPrice: coin.newPrice,
            change: coin.change,
            time: new Date(coin.time).toLocaleTimeString(),
            logo: coin.logo,
          };
        });
        dispatch(setMarketActivity(activityList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarketActivity();
    const intervalId = setInterval(fetchMarketActivity, ACTIVITY_INTERVAL);
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export default useMarketActivity;
