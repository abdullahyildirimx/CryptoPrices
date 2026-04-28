export const priceUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr';
export const exchangeInfoUrl =
  'https://fapi.binance.com/fapi/v1/exchangeInfo';
export const marketActivityUrl = 'https://api.cryptoprices.tech/activity';
export const coinLogosUrl =
  'https://www.binance.com/bapi/apex/v1/public/apex/marketing/futures/asset/logo';
export const getLogoFromUrl = (url) => {
  return `https://api.cryptoprices.tech/logo?url=${url}`;
};
