import MarketPricesCard from '../components/MarketPricesCard';
import MarketActivityCard from '../components/MarketActivityCard';
import useFuturesData from '../hooks/useFuturesData';
import useFuturesMarketActivity from '../hooks/useFuturesMarketActivity';

const FuturesPage = () => {
  useFuturesData();
  useFuturesMarketActivity();

  return (
    <main className="p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
      <MarketPricesCard />
      <MarketActivityCard />
    </main>
  );
};

export default FuturesPage;
