import { createSlice } from '@reduxjs/toolkit';
import { getSpotCardStorage, getFuturesCardStorage } from './localStorageUtils';

const spotStorage = getSpotCardStorage();
const futuresStorage = getFuturesCardStorage();

const ReduxSlice = createSlice({
  name: 'dataStore',
  initialState: {
    spotCoinData: null,
    futuresCoinData: null,
    spotCoinMetadata: null,
    futuresCoinMetadata: null,
    spotMarketActivity: null,
    futuresMarketActivity: null,
    spotFavoriteCoins: spotStorage?.favoriteCoins || [],
    futuresFavoriteCoins: futuresStorage?.favoriteCoins || [],
  },
  reducers: {
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
