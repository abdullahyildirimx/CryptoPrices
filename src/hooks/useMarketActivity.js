import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setMarketActivity } from '../utils/reduxStorage';
import { marketActivityUrl } from '../utils/urls';

const useMarketActivity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMarketActivity = async () => {
      try {
        const response = await axios.get(marketActivityUrl);
        const jsonData = response.data;
        const activityList = jsonData.map((coin) => {
          const symbol = coin.symbol;
          const oldPrice = coin.oldPrice;
          const newPrice = coin.newPrice;
          const change = coin.change;
          const time = new Date(coin.time).toLocaleTimeString();
          const logo = coin.logo;

          return {
            symbol: symbol,
            oldPrice: oldPrice,
            newPrice: newPrice,
            change: change,
            time: time,
            logo: logo,
          };
        });
        dispatch(setMarketActivity(activityList));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarketActivity();
    const intervalId = setInterval(fetchMarketActivity, 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export default useMarketActivity;
