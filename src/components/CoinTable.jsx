import { useState } from 'react';
import { getLogoFromUrl } from '../utils/urls';
import ChartModal from './ChartModal';
import { Button } from '@base-ui/react';

const CoinTable = ({ coins, favoriteCoins, toggleFavorite }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleFavorite = (e, symbol) => {
    e.stopPropagation();
    toggleFavorite(symbol);
  };

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

  const formatChange = (change) => {
    const parsedChange = parseFloat(change);
    const formattedChange = parsedChange.toFixed(2);
    return parsedChange < 0 ? `${formattedChange}%` : `+${formattedChange}%`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1_000_000_000) {
      return `$${(volume / 1_000_000_000).toFixed(2)}B`;
    } else if (volume >= 1_000_000) {
      return `$${(volume / 1_000_000).toFixed(2)}M`;
    } else if (volume >= 1_000) {
      return `$${(volume / 1_000).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };

  return (
    <>
      {coins.map((item) => (
        <div
          key={item.symbol}
          className="p-8 rounded-lg font-semibold hover:bg-gray-800 hover:cursor-pointer"
          onClick={() => handleOpenChart(item.symbol)}
        >
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center">
              <Button
                className="w-20 h-20"
                aria-label="favorite-button"
                onClick={(e) => handleToggleFavorite(e, item.symbol)}
              >
                {favoriteCoins.includes(item.symbol) ? (
                  <i className="align-middle fa-solid fa-star text-gold1"></i>
                ) : (
                  <i className="align-middle fa-regular fa-star text-white1"></i>
                )}
              </Button>
              <img
                className="mx-8 rounded-full"
                src={getLogo(item)}
                alt={item.symbol}
                width={24}
                height={24}
                onError={(e) => {
                  e.target.src = '/genericicon.png';
                }}
              />
              <div className="flex flex-col">
                <div className="flex items-center">{item.symbol}</div>
                <div className="flex text-grey1 items-center">
                  {formatVolume(item.volume)}
                </div>
              </div>
            </div>
            <div className="text-end">
              <div>${item.price}</div>
              <span
                className={`${item.change < 0 ? 'text-red3' : 'text-green3'}`}
              >
                {formatChange(item.change)}
              </span>
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

export default CoinTable;
