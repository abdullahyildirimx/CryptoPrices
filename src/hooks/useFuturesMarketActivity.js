import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setFuturesMarketActivity } from '../utils/reduxStorage';
import { futuresMarketActivityUrl } from '../utils/urls';

const useFuturesMarketActivity = (enabled) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const fetchMarketActivity = async () => {
      try {
        const response = await axios.get(futuresMarketActivityUrl);
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
        dispatch(setFuturesMarketActivity(activityList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarketActivity();
    const intervalId = setInterval(fetchMarketActivity, 10000);
    return () => clearInterval(intervalId);
  }, [enabled, dispatch]);
};

export default useFuturesMarketActivity;
