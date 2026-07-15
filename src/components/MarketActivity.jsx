import { useDispatch } from 'react-redux';
import { setSelectedCoin } from '../utils/reduxStorage';
import { getLogoFromUrl } from '../utils/urls';

const MarketActivity = ({ activity }) => {
  const dispatch = useDispatch();

  const handleOpenChart = (symbol) => {
    dispatch(setSelectedCoin(symbol));
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
              <div className="flex items-center gap-4 max-w-150 md:max-w-180 text-grey1">
                <div className="text-white1">{item.symbol}</div>
                {item.isTradFi && (
                  <div className="truncate text-[10px] md:text-[11px] font-medium">
                    {`${'| '}${item.tradFiName}`}
                  </div>
                )}
              </div>
              <div className="text-grey1">{item.time}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div
              className={`text-[12px] md:text-[13px] font-semibold ${item.change < 0 ? 'text-red1' : 'text-green1'}`}
            >
              ${item.price}
            </div>
            <div
              className={`text-[12px] md:text-[13px] font-semibold ${item.change < 0 ? 'text-red1' : 'text-green1'}`}
            >
              {item.change > 0 ? '↑' : '↓'}
              {parseFloat(item.change).toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MarketActivity;
