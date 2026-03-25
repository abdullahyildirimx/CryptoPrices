export const getMarketTypeStorage = () => {
  return JSON.parse(localStorage.getItem('marketType'));
};

export const getSelectedTabStorage = () => {
  return JSON.parse(localStorage.getItem('selectedTab'));
};

export const getFavoriteCoinsStorage = () => {
  return JSON.parse(localStorage.getItem('favoriteCoins'));
};

export const getShowOnlyFavoritesStorage = () => {
  return JSON.parse(localStorage.getItem('showOnlyFavorites'));
};

export const setMarketTypeStorage = (value) => {
  localStorage.setItem('marketType', JSON.stringify(value));
};

export const setSelectedTabStorage = (value) => {
  localStorage.setItem('selectedTab', JSON.stringify(value));
};

export const setFavoriteCoinsStorage = (key, value) => {
  const favoriteCoins = JSON.parse(localStorage.getItem('favoriteCoins')) || {};
  favoriteCoins[key] = value;
  localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
};

export const setShowOnlyFavoritesStorage = (value) => {
  localStorage.setItem('showOnlyFavorites', JSON.stringify(value));
};
