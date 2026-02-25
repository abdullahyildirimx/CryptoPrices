export const spotPriceUrl = 'https://api.binance.com/api/v3/ticker/24hr';
export const futuresPriceUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr';
export const spotExchangeInfoUrl =
  'https://api.binance.com/api/v3/exchangeInfo';
export const futuresExchangeInfoUrl =
  'https://fapi.binance.com/fapi/v1/exchangeInfo';
export const spotMarketActivityUrl = 'https://api.cryptoprices.tech/spot';
export const futuresMarketActivityUrl = 'https://api.cryptoprices.tech/futures';
export const coinLogosUrl =
  'https://www.binance.com/bapi/apex/v1/public/apex/marketing/futures/asset/logo';
export const getLogoFromUrl = (url) => {
  return `https://api.cryptoprices.tech/logo?url=${url}`;
};
