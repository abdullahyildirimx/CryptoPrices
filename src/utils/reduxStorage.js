import { createSlice } from '@reduxjs/toolkit';
import {
  getMarketTypeStorage,
  getFavoriteCoinsStorage,
} from './localStorageUtils';

const marketTypeStorage = getMarketTypeStorage();
const favoriteCoinsStorage = getFavoriteCoinsStorage();

const ReduxSlice = createSlice({
  name: 'dataStore',
  initialState: {
    marketType: marketTypeStorage === 'futures' ? 'futures' : 'spot',
    spotCoinData: null,
    futuresCoinData: null,
    spotCoinMetadata: null,
    futuresCoinMetadata: null,
    spotMarketActivity: null,
    futuresMarketActivity: null,
    spotFavoriteCoins: favoriteCoinsStorage?.spot || [],
    futuresFavoriteCoins: favoriteCoinsStorage?.futures || [],
  },
  reducers: {
    setMarketType(state, action) {
      state.marketType = action.payload;
    },
    setSpotCoinData(state, action) {
      state.spotCoinData = action.payload;
    },
    setFuturesCoinData(state, action) {
      state.futuresCoinData = action.payload;
    },
    setSpotCoinMetadata(state, action) {
      state.spotCoinMetadata = action.payload;
    },
    setFuturesCoinMetadata(state, action) {
      state.futuresCoinMetadata = action.payload;
    },
    setSpotMarketActivity(state, action) {
      state.spotMarketActivity = action.payload;
    },
    setFuturesMarketActivity(state, action) {
      state.futuresMarketActivity = action.payload;
    },
    setSpotFavoriteCoins(state, action) {
      state.spotFavoriteCoins = action.payload;
    },
    setFuturesFavoriteCoins(state, action) {
      state.futuresFavoriteCoins = action.payload;
    },
  },
});

export const {
  setMarketType,
  setSpotCoinData,
  setFuturesCoinData,
  setSpotCoinMetadata,
  setFuturesCoinMetadata,
  setSpotMarketActivity,
  setFuturesMarketActivity,
  setSpotFavoriteCoins,
  setFuturesFavoriteCoins,
} = ReduxSlice.actions;
export default ReduxSlice.reducer;
