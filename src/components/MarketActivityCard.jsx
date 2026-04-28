import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import {
  getShowOnlyFavoritesStorage,
  setShowOnlyFavoritesStorage,
} from '../utils/localStorageUtils';
import MarketActivity from './MarketActivity';
import { getLogoFromUrl } from '../utils/urls';
import { Checkbox } from '@base-ui/react';
import SearchBar from './SearchBar';

const MarketActivityCard = () => {
  const [showFavorites, setShowFavorites] = useState(
    getShowOnlyFavoritesStorage() || false,
  );
  const [searchedCoins, setSearchedCoins] = useState(null);
  const { coinData, marketActivity, favoriteCoins } = useSelector(
    (state) => state.dataStore,
  );

  const handleToggleFavorites = (value) => {
    setShowFavorites(value);
    setShowOnlyFavoritesStorage(value);
  };

  const getLogo = (symbol) => {
    const url = coinData?.find((data) => data.symbol === symbol)?.logo;
    return url ? getLogoFromUrl(url) : '/genericicon.png';
  };

  const filterActivities = () => {
    if (!marketActivity) return [];

    const base = searchedCoins
      ? marketActivity.filter((item) => searchedCoins.includes(item.symbol))
      : showFavorites
        ? marketActivity.filter((item) => favoriteCoins.includes(item.symbol))
        : marketActivity.slice(0, 1000);
    return base.map((item) => ({
      ...item,
      logo: getLogo(item.symbol),
    }));
  };

  const handleSearch = (value) => {
    if (!marketActivity) return [];

    if (value) {
      const filteredResults = Array.from(
        new Set(
          marketActivity
            .filter((item) =>
              item.symbol.toLowerCase().includes(value.toLowerCase()),
            )
            .map((item) => item.symbol),
        ),
      );
      setSearchedCoins(filteredResults);
    } else {
      setSearchedCoins(null);
    }
  };

  const activity = filterActivities();

  return (
    <div className="bg-black1 rounded-2xl p-16 text-white1 text-[14px] font-medium border border-grey2">
      <div className={`flex flex-col justify-between`}>
        <div className="flex justify-between mb-14">
          <div className="flex items-center gap-4">
            <h1 className="text-[18px]/[24px] md:text-[20px]/[35px]">
              Market <br className="md:hidden" />
              Activity
            </h1>
            <i
              className="fa-regular fa-circle-question"
              data-tooltip-id="infoTooltip1"
            ></i>
          </div>
          <SearchBar handleSearch={handleSearch} id={'searchActivity'} />
        </div>
        <div className="flex items-center mb-15 gap-4">
          <label className="flex items-center gap-4 h-24">
            <Checkbox.Root
              aria-label="Show only favorites"
              className="
                w-14 h-14 rounded-sm border border-grey2 
                data-checked:border-blue-500 data-checked:bg-blue-500
                flex items-center justify-center
                transition-all duration-150 ease-in-out cursor-pointer
                hover:border-blue-500
              "
              checked={showFavorites}
              onCheckedChange={(value) => handleToggleFavorites(value)}
            >
              <Checkbox.Indicator>
                <i className="fa-solid fa-check text-[10px]" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Show only favorites
          </label>
          <i
            className="fa-regular fa-circle-question"
            data-tooltip-id="infoTooltip2"
          ></i>
        </div>
      </div>
      <Tooltip
        className="w-200! bg-black! opacity-100!"
        id="infoTooltip1"
        place="bottom"
        variant="dark"
        content="5 minutes unusual price activity. For BTC, ETH, XAU and XAG, it is triggered when price is changed over 1%, for other coins it is 3%."
      />
      <Tooltip
        className="w-200! bg-black! opacity-100!"
        id="infoTooltip2"
        place="bottom"
        variant="dark"
        content="If 'Show only favorites' is unchecked, you may see many activities. The latest maximum of 1000 activities is displayed at once."
      />
      <div
        className={`h-275 md:h-[calc(100vh-229px)] text-[12px] md:text-[14px] overflow-y-auto ${!activity.length ? 'flex justify-center items-center' : ''}`}
      >
        {marketActivity ? (
          searchedCoins?.length === 0 ? (
            <div className="flex justify-center items-center">
              No results found.
            </div>
          ) : (
            <>
              <MarketActivity activity={activity} />
              {!activity.length &&
                (showFavorites ? (
                  <p>There is no market activity for your favorite coins.</p>
                ) : (
                  <p>There is no market activity.</p>
                ))}
            </>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-36 h-36 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketActivityCard;
