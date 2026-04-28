import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import CoinTable from './CoinTable';
import {
  getSelectedTabStorage,
  setSelectedTabStorage,
  setFavoriteCoinsStorage,
} from '../utils/localStorageUtils';
import {
  setSpotFavoriteCoins,
  setFuturesFavoriteCoins,
} from '../utils/reduxStorage';
import { Button } from '@base-ui/react';

const MarketPricesCard = ({ isSpot }) => {
  const tabs = isSpot ? ['favorite', 'all'] : ['favorite', 'tradfi', 'all'];
  const [selectedTab, setSelectedTab] = useState(() => {
    const stored = getSelectedTabStorage();
    return tabs.includes(stored) ? stored : 'all';
  });
  const [sortOrder, setSortOrder] = useState('default');
  const [searchedCoins, setSearchedCoins] = useState(null);
  const {
    spotCoinData,
    spotFavoriteCoins,
    futuresCoinData,
    futuresFavoriteCoins,
  } = useSelector((state) => state.dataStore);
  const selectedCoinData = isSpot ? spotCoinData : futuresCoinData;
  const selectedFavoriteCoins = isSpot
    ? spotFavoriteCoins
    : futuresFavoriteCoins;
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
    if (isSpot) {
      if (spotFavoriteCoins.includes(symbol)) {
        const updatedFavorites = spotFavoriteCoins.filter(
          (coin) => coin !== symbol,
        );
        dispatch(setSpotFavoriteCoins(updatedFavorites));
        setFavoriteCoinsStorage('spot', updatedFavorites);
      } else {
        const updatedFavorites = [...spotFavoriteCoins, symbol];
        dispatch(setSpotFavoriteCoins(updatedFavorites));
        setFavoriteCoinsStorage('spot', updatedFavorites);
      }
    } else {
      if (futuresFavoriteCoins.includes(symbol)) {
        const updatedFavorites = futuresFavoriteCoins.filter(
          (coin) => coin !== symbol,
        );
        dispatch(setFuturesFavoriteCoins(updatedFavorites));
        setFavoriteCoinsStorage('futures', updatedFavorites);
      } else {
        const updatedFavorites = [...futuresFavoriteCoins, symbol];
        dispatch(setFuturesFavoriteCoins(updatedFavorites));
        setFavoriteCoinsStorage('futures', updatedFavorites);
      }
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
    if (!selectedCoinData) {
      return [];
    }
    let coins;
    if (searchedCoins) {
      coins = searchedCoins
        .map((symbol) => {
          return (
            selectedCoinData.find((data) => data.symbol === symbol) || null
          );
        })
        .filter((coin) => coin !== null);
    } else if (selectedTab === 'favorite') {
      coins = selectedFavoriteCoins
        .map((symbol) => {
          return (
            selectedCoinData.find((data) => data.symbol === symbol) || null
          );
        })
        .filter((coin) => coin !== null);
    } else if (selectedTab === 'tradfi') {
      coins = selectedCoinData.filter((data) => data.isTradFi);
    } else {
      coins = selectedCoinData;
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
    if (!selectedCoinData) {
      return [];
    }
    if (value) {
      const filteredResults = selectedCoinData
        .filter((item) =>
          item.symbol.toLowerCase().includes(value.toLowerCase()),
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
        {selectedCoinData
          ? `${formatTitlePrice(selectedCoinData?.find((item) => item.symbol === 'BTC')?.price)} | CryptoPrices`
          : 'CryptoPrices'}
      </title>
      <div className="bg-black1 rounded-2xl p-16 text-white1 text-[14px] font-medium border border-grey2">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px]/[24px] md:text-[20px]">
            {isSpot ? 'Spot Market' : 'Futures Market'}
          </h1>
          <SearchBar
            key={isSpot}
            handleSearch={handleSearch}
            id={'searchCoin'}
          />
        </div>
        <div className="flex items-center">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                handleTabChange(tab);
              }}
              className={`
                px-16 py-8 font-medium transition-all duration-150 ease-in-out
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
        <div className="relative w-full h-2 bg-grey2 rounded-full">
          <span
            className={`
              absolute top-0 w-20 h-2 rounded-full bg-white1
              transition-all duration-300 ease-in-out
              ${
                isSpot
                  ? selectedTab === 'all'
                    ? 'translate-x-96'
                    : 'translate-x-31'
                  : selectedTab === 'all'
                    ? 'translate-x-166'
                    : selectedTab === 'tradfi'
                      ? 'translate-x-107'
                      : 'translate-x-31'
              }
            `}
          />
        </div>
        <div className="text-[11px]/[16px] md:text-[14px]/[21px] px-8 py-12 ml-60 flex justify-between items-center">
          <div className="flex items-center">
            <span
              className={
                sortOrder.includes('symbol') ? 'text-white1' : 'text-grey1'
              }
            >
              Coin
            </span>
            <Button
              aria-label="symbol-sort-button"
              onClick={() => toggleSortOrder('symbol')}
              className="flex justify-center items-center"
            >
              {sortOrder === 'symbolAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'symbolDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
            <span className="text-grey1">/</span>
            <span
              className={
                sortOrder.includes('volume') ? 'text-white1' : 'text-grey1'
              }
            >
              Volume
            </span>
            <Button
              aria-label="volume-sort-button"
              onClick={() => toggleSortOrder('volume')}
              className="flex justify-center items-center"
            >
              {sortOrder === 'volumeAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'volumeDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
          </div>
          <div className="flex items-center text-end">
            <span
              className={
                sortOrder.includes('price') ? 'text-white1' : 'text-grey1'
              }
            >
              Price
            </span>
            <Button
              aria-label="price-sort-button"
              onClick={() => toggleSortOrder('price')}
              className="flex justify-center items-center"
            >
              {sortOrder === 'priceAsc' ? (
                <i className="fa-solid fa-sort-up text-white1"></i>
              ) : sortOrder === 'priceDesc' ? (
                <i className="fa-solid fa-sort-down text-white1"></i>
              ) : (
                <i className="fa-solid fa-sort text-grey1"></i>
              )}
            </Button>
            <span className="text-grey1">/</span>
            <span
              className={
                sortOrder.includes('change') ? 'text-white1' : 'text-grey1'
              }
            >
              Change
            </span>
            <Button
              aria-label="change-sort-button"
              onClick={() => toggleSortOrder('change')}
              className="flex justify-center items-center"
            >
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
        <div className="h-250 md:h-[calc(100vh-275px)] overflow-y-auto text-[12px] md:text-[14px]">
          {selectedCoinData ? (
            searchedCoins?.length === 0 ? (
              <div className="h-full flex justify-center items-center">
                No results found.
              </div>
            ) : selectedTab === 'favorite' && !selectedFavoriteCoins.length ? (
              <div className="h-full flex justify-center items-center">
                You don&apos;t have any favorite coins.
              </div>
            ) : (
              <CoinTable
                coins={coins}
                isSpot={isSpot}
                favoriteCoins={selectedFavoriteCoins}
                toggleFavorite={toggleFavorite}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-36 h-36 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketPricesCard;
