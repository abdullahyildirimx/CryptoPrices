import { createSlice } from '@reduxjs/toolkit';
import {
  getFavoriteCoinsStorage,
} from './localStorageUtils';

const favoriteCoinsStorage = getFavoriteCoinsStorage();

const ReduxSlice = createSlice({
  name: 'dataStore',
  initialState: {
    coinData: null,
    marketActivity: null,
    favoriteCoins: favoriteCoinsStorage || [],
  },
  reducers: {
    setCoinData(state, action) {
      state.coinData = action.payload;
    },
    setMarketActivity(state, action) {
      state.marketActivity = action.payload;
    },
    setFavoriteCoins(state, action) {
      state.favoriteCoins = action.payload;
    },
  },
});

export const {
  setCoinData,
  setMarketActivity,
  setFavoriteCoins,
} = ReduxSlice.actions;
export default ReduxSlice.reducer;
