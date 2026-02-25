import MarketPricesCard from '../components/MarketPricesCard';
import MarketActivityCard from '../components/MarketActivityCard';
import useSpotData from '../hooks/useSpotData';
import useSpotMarketActivity from '../hooks/useSpotMarketActivity';

const SpotPage = () => {
  useSpotData();
  useSpotMarketActivity();

  return (
    <main className="p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
      <MarketPricesCard isSpot />
      <MarketActivityCard isSpot />
    </main>
  );
};

export default SpotPage;
