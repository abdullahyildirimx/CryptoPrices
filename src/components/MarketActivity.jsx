import { useState } from 'react';
import ChartModal from './ChartModal';

const MarketActivity = ({ activity }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChart = (symbol) => {
    setSelectedCoin(symbol);
    setIsOpen(true);
  };

  const handleCloseChart = () => {
    setIsOpen(false);
    setSelectedCoin(null);
  };

  return (
    <>
      {activity.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-8 font-semibold rounded-lg hover:bg-gray-800 hover:cursor-pointer"
          onClick={() => handleOpenChart(item.symbol)}
        >
          <div className="flex justify-between items-center gap-8">
            <img
              className="rounded-full"
              src={item.logo}
              alt={item.symbol}
              width={30}
              height={30}
              onError={(e) => {
                e.target.src = '/genericicon.png';
              }}
            />
            <div className="flex flex-col">
              <span>{item.symbol}</span>
              <span className="text-grey1">{item.time}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div
              className={`text-[12px] rounded-[5px] font-semibold py-2 px-8 ${item.change < 0 ? 'text-red1 bg-red2' : 'text-green1 bg-green2'}`}
            >
              {item.oldPrice} → {item.newPrice}
            </div>
            <span
              className={`max-w-max text-[12px] rounded-[5px] font-semibold py-2 px-8 ${item.change < 0 ? 'text-red1 bg-red2' : 'text-green1 bg-green2'}`}
            >
              <span>{item.change > 0 ? '↑' : '↓'}</span>
              {parseFloat(item.change).toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
      <ChartModal
        isOpen={isOpen}
        onOpenChange={handleCloseChart}
        selectedCoin={selectedCoin}
      />
    </>
  );
};

export default MarketActivity;
