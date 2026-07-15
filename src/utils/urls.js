const BASE_URL = 'https://api.cryptoprices.tech';

export const priceDataUrl = `${BASE_URL}/price`;
export const marketActivityUrl = `${BASE_URL}/activity`;
export const getLogoFromUrl = (url) => {
  return `${BASE_URL}/logo?url=${url}`;
};
