import MarketPricesCard from '../components/MarketPricesCard';
import MarketActivityCard from '../components/MarketActivityCard';
import usePriceData from '../hooks/usePriceData';
import useMarketActivity from '../hooks/useMarketActivity';

const HomePage = () => {
  usePriceData();
  useMarketActivity();

  return (
    <main className="p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
      <MarketPricesCard />
      <MarketActivityCard />
    </main>
  );
};

export default HomePage;
