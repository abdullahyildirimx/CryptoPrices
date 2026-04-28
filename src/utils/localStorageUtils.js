export const getSelectedTabStorage = () => {
  return JSON.parse(localStorage.getItem('selectedTab'));
};

export const getFavoriteCoinsStorage = () => {
  return JSON.parse(localStorage.getItem('favoriteCoins'));
};

export const getShowOnlyFavoritesStorage = () => {
  return JSON.parse(localStorage.getItem('showOnlyFavorites'));
};

export const setSelectedTabStorage = (value) => {
  localStorage.setItem('selectedTab', JSON.stringify(value));
};

export const setFavoriteCoinsStorage = (value) => {
  localStorage.setItem('favoriteCoins', JSON.stringify(value));
};

export const setShowOnlyFavoritesStorage = (value) => {
  localStorage.setItem('showOnlyFavorites', JSON.stringify(value));
};
