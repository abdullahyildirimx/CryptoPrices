import { createSlice } from '@reduxjs/toolkit';
import { getFavoriteCoinsStorage } from './localStorageUtils';

const favoriteCoinsStorage = getFavoriteCoinsStorage();
const selectedCoin = new URLSearchParams(window.location.search).get('coin');

const ReduxSlice = createSlice({
  name: 'dataStore',
  initialState: {
    coinData: null,
    marketActivity: null,
    favoriteCoins: favoriteCoinsStorage || [],
    selectedCoin: selectedCoin,
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
    setSelectedCoin(state, action) {
      state.selectedCoin = action.payload;
    },
  },
});

export const {
  setCoinData,
  setMarketActivity,
  setFavoriteCoins,
  setSelectedCoin,
} = ReduxSlice.actions;
export default ReduxSlice.reducer;
