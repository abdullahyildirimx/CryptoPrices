import { useSelector } from 'react-redux';
import MarketPricesCard from '../components/MarketPricesCard';
import MarketActivityCard from '../components/MarketActivityCard';
import useSpotData from '../hooks/useSpotData';
import useSpotMarketActivity from '../hooks/useSpotMarketActivity';
import useFuturesData from '../hooks/useFuturesData';
import useFuturesMarketActivity from '../hooks/useFuturesMarketActivity';

const HomePage = () => {
  const { marketType } = useSelector((state: any) => state.dataStore);
  const isSpot = marketType === 'spot';

  useSpotData(isSpot);
  useFuturesData(!isSpot);
  useSpotMarketActivity(isSpot);
  useFuturesMarketActivity(!isSpot);

  return (
    <main className="p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <MarketPricesCard isSpot={isSpot} />
        <MarketActivityCard isSpot={isSpot} />
      </div>
    </main>
  );
};

export default HomePage;
