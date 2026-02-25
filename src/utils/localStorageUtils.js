export const getSpotCardStorage = () => {
  return JSON.parse(localStorage.getItem('spotCard'));
};

export const getFuturesCardStorage = () => {
  return JSON.parse(localStorage.getItem('futuresCard'));
};

export const getSpotMarketActivityStorage = () => {
  return JSON.parse(localStorage.getItem('spotMarketActivity'));
};

export const getFuturesMarketActivityStorage = () => {
  return JSON.parse(localStorage.getItem('futuresMarketActivity'));
};

export const setSpotCardStorage = (key, value) => {
  const spotCard = JSON.parse(localStorage.getItem('spotCard')) || {};
  spotCard[key] = value;
  localStorage.setItem('spotCard', JSON.stringify(spotCard));
};

export const setFuturesCardStorage = (key, value) => {
  const futuresCard = JSON.parse(localStorage.getItem('futuresCard')) || {};
  futuresCard[key] = value;
  localStorage.setItem('futuresCard', JSON.stringify(futuresCard));
};

export const setSpotMarketActivityStorage = (key, value) => {
  const marketActivity =
    JSON.parse(localStorage.getItem('spotMarketActivity')) || {};
  marketActivity[key] = value;
  localStorage.setItem('spotMarketActivity', JSON.stringify(marketActivity));
};

export const setFuturesMarketActivityStorage = (key, value) => {
  const marketActivity =
    JSON.parse(localStorage.getItem('futuresMarketActivity')) || {};
  marketActivity[key] = value;
  localStorage.setItem('futuresMarketActivity', JSON.stringify(marketActivity));
};
