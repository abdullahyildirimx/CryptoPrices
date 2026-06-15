import { useState } from 'react';
import ChartModal from './ChartModal';
import { getLogoFromUrl } from '../utils/urls';

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

  const getLogo = (item) => {
    return item?.logo ? getLogoFromUrl(item.logo) : '/genericicon.png';
  };

  return (
    <>
      {activity.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-8 font-semibold rounded-lg hover:bg-greyhover hover:cursor-pointer"
          onClick={() => handleOpenChart(item.symbol)}
        >
          <div className="flex justify-between items-center gap-8">
            <img
              className="rounded-full"
              src={getLogo(item)}
              alt={item.symbol}
              width={30}
              height={30}
              onError={(e) => {
                e.target.src = '/genericicon.png';
              }}
            />
            <div className="flex flex-col">
              <div>{item.symbol}</div>
              <div className="text-grey1">{item.time}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div
              className={`text-[12px] rounded-[5px] font-semibold py-2 px-8 ${item.change < 0 ? 'text-red1 bg-red2' : 'text-green1 bg-green2'}`}
            >
              {item.oldPrice} → {item.newPrice}
            </div>
            <div
              className={`text-[12px] rounded-[5px] font-semibold py-2 px-8 ${item.change < 0 ? 'text-red1 bg-red2' : 'text-green1 bg-green2'}`}
            >
              {item.change > 0 ? '↑' : '↓'}
              {parseFloat(item.change).toFixed(2)}%
            </div>
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
