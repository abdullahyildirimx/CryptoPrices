'use strict';
import express from 'express';
import { Buffer } from 'buffer';
import fs from 'fs/promises';

const app = express();

const ACTIVITY_FILE = './activity.json';

let priceData = [];
let activityData = [];

let coinMetadata = null;
let marketPrices = null;

const priceUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr';
const exchangeInfoUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
const coinLogosUrl =
  'https://www.binance.com/bapi/apex/v1/public/apex/marketing/futures/asset/logo';

const coinListDelta = 300000;
const marketPricesDelta = 5000;
const activityDelta = 10000;
const purgeControlDelta = 300000;
const purgeDelta = 86400000;

const bigcoinTriggerLow = 0.99;
const bigcoinTriggerHigh = 1.01;
const altcoinTriggerLow = 0.97;
const altcoinTriggerHigh = 1.03;
const bigCoinList = ['BTC', 'ETH', 'XAU', 'XAG'];
const blacklist = [];

const loadActivityData = async () => {
  try {
    const file = await fs.readFile(ACTIVITY_FILE, 'utf8');
    activityData = JSON.parse(file);
  } catch {
    activityData = [];
  }
};

const saveActivityData = async () => {
  await fs.writeFile(ACTIVITY_FILE, JSON.stringify(activityData, null, 2));
};

const countDecimalPlaces = (num) => {
  let reduced = parseFloat(num);
  if (parseFloat(num) >= 1) {
    return 0;
  }
  reduced = reduced.toString();
  if (reduced === '1e-7') {
    return 7;
  }
  if (reduced === '1e-8') {
    return 8;
  }
  return reduced.split('.')[1].length;
};

const fetchCoinList = async () => {
  try {
    const response = await fetch(exchangeInfoUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();

    const response2 = await fetch(coinLogosUrl);
    if (!response2.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData2 = await response2.json();
    const logoData = jsonData2.data;

    const filteredCoins = jsonData.symbols.filter((coin) => {
      return coin.symbol.endsWith('USDT') && coin.status === 'TRADING';
    });

    coinMetadata = filteredCoins
      .map((item) => {
        const symbol = item.symbol.slice(0, -'USDT'.length);
        const tickSize = countDecimalPlaces(item.filters[0].tickSize);
        const isTradFi = item.contractType === 'TRADIFI_PERPETUAL';
        const logo = logoData.find((coin) => coin?.asset === symbol)?.logo;

        return {
          symbol: symbol,
          tickSize: tickSize,
          isTradFi: isTradFi,
          logo: logo,
        };
      })
      .slice()
      .sort((a, b) => {
        return a.symbol.localeCompare(b.symbol);
      });

    const coinSymbolList = filteredCoins
      .map((item) => {
        let symbol = item.symbol;
        symbol = symbol.slice(0, -'USDT'.length);
        return symbol;
      })
      .slice()
      .filter((symbol) => !blacklist.includes(symbol))
      .sort((a, b) => {
        return a.localeCompare(b);
      });

    priceData = coinSymbolList.map((item) => {
      const data =
        priceData?.find((coin) => coin.symbol === item)?.data ||
        Array(30).fill(0);
      return {
        symbol: item,
        data: data,
      };
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchMarketPrices = async () => {
  try {
    const response = await fetch(priceUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    const currentTime = Date.now();
    const filteredCoins = jsonData.filter((coin) => {
      return (
        coin.symbol.endsWith('USDT') && currentTime <= coin.closeTime + 1800000
      );
    });

    marketPrices = filteredCoins.map((coin) => {
      const symbol = coin.symbol.slice(0, -'USDT'.length);
      let price = coin.lastPrice;
      const volume = coin.quoteVolume;
      const change = coin.priceChangePercent;
      let logo = null;
      let isTradFi = null;

      if (coinMetadata) {
        let metadata = coinMetadata.find((coin) => coin.symbol === symbol);
        if (metadata) {
          const tickSizeDecimals = metadata.tickSize;
          price = parseFloat(price).toFixed(tickSizeDecimals);
          logo = metadata.logo;
          isTradFi = metadata.isTradFi;
        }
      } else {
        price = parseFloat(price);
      }

      return {
        symbol: symbol,
        price: price,
        volume: volume,
        change: change,
        logo: logo,
        isTradFi: isTradFi,
      };
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchMarketActivity = async () => {
  try {
    if (!priceData || !marketPrices) {
      return;
    }
    const prices = marketPrices;

    let resultArray = [];
    const newPriceData = priceData.slice();
    newPriceData.forEach((coin, i) => {
      const currentCoinData = prices.find(
        (item) => item.symbol === coin.symbol,
      );
      if (!currentCoinData) {
        return;
      }
      const currentPrice = parseFloat(currentCoinData.price);
      for (let k = 0; k < newPriceData[i]['data'].length; k++) {
        const prevPrice = newPriceData[i]['data'][k];
        if (prevPrice !== 0) {
          const rate = currentPrice / prevPrice;
          const currentTime = Date.now();
          if (
            (bigCoinList.includes(coin.symbol) &&
              (rate <= bigcoinTriggerLow || rate >= bigcoinTriggerHigh)) ||
            rate <= altcoinTriggerLow ||
            rate >= altcoinTriggerHigh
          ) {
            const tickSize = coinMetadata?.find(
              (data) => data.symbol === coin.symbol,
            )?.tickSize;
            const formattedPrevPrice = tickSize
              ? parseFloat(prevPrice).toFixed(tickSize)
              : prevPrice;
            const formattedNewPrice = tickSize
              ? parseFloat(currentPrice).toFixed(tickSize)
              : currentPrice;
            let result = {
              symbol: coin.symbol,
              oldPrice: formattedPrevPrice,
              newPrice: formattedNewPrice,
              change: parseFloat(((rate - 1) * 100).toFixed(2)),
              time: currentTime,
            };
            resultArray.push(result);
            newPriceData[i]['data'] = Array(30).fill(0);
            break;
          }
        }
      }
      newPriceData[i]['data'].shift();
      newPriceData[i]['data'].push(currentPrice);
    });
    if (resultArray.length > 0) {
      activityData = [...resultArray, ...activityData];
      await saveActivityData();
    }
    priceData = newPriceData;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const purgeData = () => {
  const currentTime = Date.now();
  activityData = activityData.filter((activity) => {
    return activity.time > currentTime - purgeDelta;
  });
  saveActivityData();
};

await loadActivityData();
fetchCoinList();
setInterval(fetchCoinList, coinListDelta);
setInterval(fetchMarketPrices, marketPricesDelta);
setInterval(fetchMarketActivity, activityDelta);
setInterval(purgeData, purgeControlDelta);

app.get('/', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).send('Hello!');
});

app.get('/price', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).send(marketPrices);
});

app.get('/activity', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).send(activityData);
});

app.get('/logo', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url param');

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(500).send('Error fetching image');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=2592000, immutable');
    res.status(200).send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching image');
  }
});

app.listen(5000, function () {});
