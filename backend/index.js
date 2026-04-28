'use strict';
import express from 'express';
import { Buffer } from 'buffer';
import fs from 'fs/promises';

const app = express();

const ACTIVITY_FILE = './activity.json';

let priceData = [];
let activityData = [];

const priceUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr';
const exchangeInfoUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo';

const coinListDelta = 300000;
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

const fetchCoinList = async () => {
  try {
    const response = await fetch(exchangeInfoUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();

    const filteredCoins = jsonData.symbols.filter((coin) => {
      return coin.symbol.endsWith('USDT') && coin.status === 'TRADING';
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

const fetchMarketActivity = async () => {
  try {
    if (!priceData) {
      return;
    }
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

    const prices = filteredCoins.map((item) => {
      let symbol = item.symbol;
      const price = parseFloat(item.lastPrice);
      symbol = symbol.slice(0, -'USDT'.length);
      return {
        symbol: symbol,
        price: price,
      };
    });
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
            let result = {
              symbol: coin.symbol,
              oldPrice: prevPrice,
              newPrice: currentPrice,
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
setInterval(fetchMarketActivity, activityDelta);
setInterval(purgeData, purgeControlDelta);

app.get('/', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).send('Hello!');
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
