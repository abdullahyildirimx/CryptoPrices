import MarketPricesCard from '../components/MarketPricesCard';
import MarketActivityCard from '../components/MarketActivityCard';
import usePriceData from '../hooks/usePriceData';
import useMarketActivity from '../hooks/useMarketActivity';
import ChartModal from '../components/ChartModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCoin } from '../utils/reduxStorage';

const HomePage = () => {
  const dispatch = useDispatch();
  const { selectedCoin } = useSelector((state) => state.dataStore);

  usePriceData();
  useMarketActivity();

  const handleCloseChart = () => {
    dispatch(setSelectedCoin(null));
    window.history.replaceState(null, '', '/');
  };

  return (
    <main className="px-16 pt-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-16">
      <MarketPricesCard />
      <MarketActivityCard />
      {selectedCoin && (
        <ChartModal
          isOpen={true}
          onOpenChange={handleCloseChart}
          selectedCoin={selectedCoin}
        />
      )}
    </main>
  );
};

export default HomePage;
