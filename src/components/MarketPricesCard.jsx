import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import CoinTable from './CoinTable';
import {
  getSelectedTabStorage,
  setSelectedTabStorage,
  setFavoriteCoinsStorage,
} from '../utils/localStorageUtils';
import { setFavoriteCoins } from '../utils/reduxStorage';
import { Button } from '@base-ui/react';

const MarketPricesCard = () => {
  const tabs = ['favorite', 'tradfi', 'all'];
  const [selectedTab, setSelectedTab] = useState(() => {
    const stored = getSelectedTabStorage();
    return tabs.includes(stored) ? stored : 'all';
  });
  const [sortOrder, setSortOrder] = useState('default');
  const [searchedCoins, setSearchedCoins] = useState(null);
  const { coinData, favoriteCoins } = useSelector((state) => state.dataStore);
  const dispatch = useDispatch();

  const formatTitlePrice = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;

    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedTabStorage(tab);
  };

  const toggleFavorite = (symbol) => {
    if (favoriteCoins.includes(symbol)) {
      const updatedFavorites = favoriteCoins.filter((coin) => coin !== symbol);
      dispatch(setFavoriteCoins(updatedFavorites));
      setFavoriteCoinsStorage(updatedFavorites);
    } else {
      const updatedFavorites = [...favoriteCoins, symbol];
      dispatch(setFavoriteCoins(updatedFavorites));
      setFavoriteCoinsStorage(updatedFavorites);
    }
  };

  const toggleSortOrder = (column) => {
    const desc = `${column}Desc`;
    const asc = `${column}Asc`;

    const nextOrder =
      sortOrder === desc ? asc : sortOrder === asc ? 'default' : desc;

    setSortOrder(nextOrder);
  };

  const sortedAllCoins = () => {
    if (!coinData) return [];

    let coins;

    if (searchedCoins) {
      coins = coinData.filter((data) => searchedCoins.includes(data.symbol));
    } else if (selectedTab === 'favorite') {
      coins = coinData.filter((data) => favoriteCoins.includes(data.symbol));
    } else if (selectedTab === 'tradfi') {
      coins = coinData.filter((data) => data.isTradFi);
    } else {
      coins = coinData;
    }

    return coins.slice().sort((a, b) => {
      const symbolA = a.symbol;
      const symbolB = b.symbol;
      const changeA = parseFloat(a.change);
      const changeB = parseFloat(b.change);
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      const volumeA = parseFloat(a.volume);
      const volumeB = parseFloat(b.volume);

      return sortOrder === 'priceAsc'
        ? priceA - priceB
        : sortOrder === 'priceDesc'
          ? priceB - priceA
          : sortOrder === 'symbolAsc'
            ? symbolA.localeCompare(symbolB)
            : sortOrder === 'symbolDesc'
              ? symbolB.localeCompare(symbolA)
              : sortOrder === 'changeAsc'
                ? changeA - changeB
                : sortOrder === 'changeDesc'
                  ? changeB - changeA
                  : sortOrder === 'volumeAsc'
                    ? volumeA - volumeB
                    : sortOrder === 'volumeDesc'
                      ? volumeB - volumeA
                      : volumeB - volumeA;
    });
  };

  const handleSearch = (value) => {
    if (!coinData) return;

    if (value) {
      const search = value.toLowerCase();

      const filteredResults = coinData
        .filter(
          (item) =>
            item.symbol.toLowerCase().includes(search) ||
            (item.isTradFi && item.tradFiName?.toLowerCase().includes(search)),
        )
        .map((item) => item.symbol);

      setSearchedCoins(filteredResults);
    } else {
      setSearchedCoins(null);
    }
  };

  const coins = sortedAllCoins();

  return (
    <>
      <title>
        {coinData
          ? `${formatTitlePrice(coinData?.find((item) => item.symbol === 'BTC')?.price)} | CryptoPrices`
          : 'CryptoPrices'}
      </title>
      <div className="bg-black1 rounded-2xl p-16 text-white1 font-medium border border-grey2">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[16px] md:text-[20px]">Market Prices</h1>
          <SearchBar handleSearch={handleSearch} id={'searchCoin'} />
        </div>
        <div className="flex items-center">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                handleTabChange(tab);
              }}
              className={`
                px-16 py-8 text-[12px] md:text-[14px] transition-all duration-150 ease-in-out
                ${
                  selectedTab === tab
                    ? 'text-white1'
                    : 'text-white-65 hover:text-white-80'
                }
              `}
            >
              {tab === 'favorite'
                ? 'Favorite'
                : tab === 'tradfi'
                  ? 'TradFi'
                  : 'All'}
            </Button>
          ))}
        </div>
        <div className="relative h-2 bg-grey2 rounded-full">
          <div
            className={`
              absolute top-0 w-20 h-2 rounded-full bg-white1
              transition-all duration-300 ease-in-out
              ${
                selectedTab === 'all'
                  ? 'translate-x-152 md:translate-x-166'
                  : selectedTab === 'tradfi'
                    ? 'translate-x-97 md:translate-x-107'
                    : 'translate-x-27 md:translate-x-31'
              }
            `}
          />
        </div>
        <div className="text-[11px]/[16px] md:text-[14px]/[21px] pl-68 pr-8 py-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => toggleSortOrder('symbol')}
              className="flex justify-center items-center"
            >
              <div
                className={
                  sortOrder.includes('symbol') ? 'text-white1' : 'text-grey1'
                }
              >
                Coin
              </div>
              {sortOrder === 'symbolAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'symbolDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
            <div className="text-grey1">/</div>
            <Button
              onClick={() => toggleSortOrder('volume')}
              className="flex justify-center items-center"
            >
              <div
                className={
                  sortOrder.includes('volume') ? 'text-white1' : 'text-grey1'
                }
              >
                Volume
              </div>
              {sortOrder === 'volumeAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'volumeDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => toggleSortOrder('price')}
              className="flex justify-center items-center"
            >
              <div
                className={
                  sortOrder.includes('price') ? 'text-white1' : 'text-grey1'
                }
              >
                Price
              </div>
              {sortOrder === 'priceAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'priceDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
            <div className="text-grey1">/</div>
            <Button
              onClick={() => toggleSortOrder('change')}
              className="flex justify-center items-center"
            >
              <div
                className={
                  sortOrder.includes('change') ? 'text-white1' : 'text-grey1'
                }
              >
                Change
              </div>
              {sortOrder === 'changeAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'changeDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
          </div>
        </div>
        <div
          className={`h-250 md:h-[calc(100vh-265px)] overflow-y-auto text-[12px] md:text-[14px] ${!coins?.length && 'flex justify-center items-center'}`}
        >
          {coinData ? (
            searchedCoins?.length === 0 ? (
              <p>No results found.</p>
            ) : selectedTab === 'favorite' && !coins?.length ? (
              <p>You don&apos;t have any favorite coins.</p>
            ) : (
              <CoinTable
                coins={coins}
                favoriteCoins={favoriteCoins}
                toggleFavorite={toggleFavorite}
              />
            )
          ) : (
            <div className="w-36 h-36 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketPricesCard;
