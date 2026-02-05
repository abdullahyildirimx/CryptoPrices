'use strict'
import express from 'express'
import { Buffer } from 'buffer'
import fs from 'fs/promises'

const app = express()

const SPOT_FILE = './spotactivity.json'
const FUTURES_FILE = './futuresactivity.json'

let spotPriceData = []
let spotActivityData = []
let futuresPriceData = []
let futuresActivityData = []

const spotPriceUrl = 'https://api.binance.com/api/v3/ticker/24hr'
const spotExchangeInfoUrl = 'https://api.binance.com/api/v3/exchangeInfo'
const futuresPriceUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr'
const futuresExchangeInfoUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo'

const coinListDelta = 300000
const activityDelta = 10000
const purgeControlDelta = 300000
const purgeDelta = 86400000

const bigcoinTriggerLow = 0.99
const bigcoinTriggerHigh = 1.01
const altcoinTriggerLow = 0.97
const altcoinTriggerHigh = 1.03
const bigCoinList = ['BTC', 'ETH', 'USDT', 'XAU', 'XAG']
const blacklist = ['BTTC']

const loadActivityData = async () => {
  try {
    const spot = await fs.readFile(SPOT_FILE, 'utf8')
    spotActivityData = JSON.parse(spot)
  } catch {
    spotActivityData = []
  }

  try {
    const futures = await fs.readFile(FUTURES_FILE, 'utf8')
    futuresActivityData = JSON.parse(futures)
  } catch {
    futuresActivityData = []
  }
}

const saveSpotData = async () => {
  await fs.writeFile(SPOT_FILE, JSON.stringify(spotActivityData, null, 2))
}

const saveFuturesData = async () => {
  await fs.writeFile(FUTURES_FILE, JSON.stringify(futuresActivityData, null, 2))
}

const fetchSpotCoinList = async () => {
  try {
    const response = await fetch(spotExchangeInfoUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()

    const filteredCoins = jsonData.symbols.filter((coin) => {
      return (
        (coin.symbol.endsWith('USDT') || coin.symbol === 'USDTTRY') &&
        coin.status === 'TRADING'
      )
    })

    const coinSymbolList = filteredCoins
      .map((item) => {
        let symbol = item.symbol
        if (symbol !== 'USDTTRY') {
          symbol = symbol.slice(0, -'USDT'.length)
        } else {
          symbol = symbol.slice(0, -'TRY'.length)
        }
        return symbol
      })
      .slice()
      .filter((symbol) => !blacklist.includes(symbol))
      .sort((a, b) => {
        return a.localeCompare(b)
      })

    spotPriceData = coinSymbolList.map((item) => {
      const data =
        spotPriceData?.find((coin) => coin.symbol === item)?.data ||
        Array(30).fill(0)
      return {
        symbol: item,
        data: data,
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchFuturesCoinList = async () => {
  try {
    const response = await fetch(futuresExchangeInfoUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()

    const filteredCoins = jsonData.symbols.filter((coin) => {
      return coin.symbol.endsWith('USDT') && coin.status === 'TRADING'
    })

    const coinSymbolList = filteredCoins
      .map((item) => {
        let symbol = item.symbol
        symbol = symbol.slice(0, -'USDT'.length)
        return symbol
      })
      .slice()
      .sort((a, b) => {
        return a.localeCompare(b)
      })

    futuresPriceData = coinSymbolList.map((item) => {
      const data =
        futuresPriceData?.find((coin) => coin.symbol === item)?.data ||
        Array(30).fill(0)
      return {
        symbol: item,
        data: data,
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchSpotMarketActivity = async () => {
  try {
    if (!spotPriceData) {
      return
    }
    const response = await fetch(spotPriceUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()

    const filteredCoins = jsonData.filter((coin) => {
      return (
        (coin.symbol.endsWith('USDT') || coin.symbol === 'USDTTRY') &&
        coin.bidPrice !== '0.00000000'
      )
    })

    const prices = filteredCoins.map((item) => {
      let symbol = item.symbol
      const price = parseFloat(item.lastPrice)
      if (symbol !== 'USDTTRY') {
        symbol = symbol.slice(0, -'USDT'.length)
      } else {
        symbol = symbol.slice(0, -'TRY'.length)
      }
      return {
        symbol: symbol,
        price: price,
      }
    })
    let resultArray = []
    const newPriceData = spotPriceData.slice()
    newPriceData.forEach((coin, i) => {
      const currentCoinData = prices.find((item) => item.symbol === coin.symbol)
      if (!currentCoinData) {
        return
      }
      const currentPrice = parseFloat(currentCoinData.price)
      for (let k = 0; k < newPriceData[i]['data'].length; k++) {
        const prevPrice = newPriceData[i]['data'][k]
        if (prevPrice !== 0) {
          const rate = currentPrice / prevPrice
          const currentTime = Date.now()
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
            }
            resultArray.push(result)
            newPriceData[i]['data'] = Array(30).fill(0)
            break
          }
        }
      }
      newPriceData[i]['data'].shift()
      newPriceData[i]['data'].push(currentPrice)
    })
    if (resultArray.length > 0) {
      spotActivityData = [...resultArray, ...spotActivityData]
      await saveSpotData()
    }
    spotPriceData = newPriceData
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchFuturesMarketActivity = async () => {
  try {
    if (!futuresPriceData) {
      return
    }
    const response = await fetch(futuresPriceUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()

    const currentTime = Date.now()
    const filteredCoins = jsonData.filter((coin) => {
      return (
        coin.symbol.endsWith('USDT') && currentTime <= coin.closeTime + 1800000
      )
    })

    const prices = filteredCoins.map((item) => {
      let symbol = item.symbol
      const price = parseFloat(item.lastPrice)
      symbol = symbol.slice(0, -'USDT'.length)
      return {
        symbol: symbol,
        price: price,
      }
    })
    let resultArray = []
    const newPriceData = futuresPriceData.slice()
    newPriceData.forEach((coin, i) => {
      const currentCoinData = prices.find((item) => item.symbol === coin.symbol)
      if (!currentCoinData) {
        return
      }
      const currentPrice = parseFloat(currentCoinData.price)
      for (let k = 0; k < newPriceData[i]['data'].length; k++) {
        const prevPrice = newPriceData[i]['data'][k]
        if (prevPrice !== 0) {
          const rate = currentPrice / prevPrice
          const currentTime = Date.now()
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
            }
            resultArray.push(result)
            newPriceData[i]['data'] = Array(30).fill(0)
            break
          }
        }
      }
      newPriceData[i]['data'].shift()
      newPriceData[i]['data'].push(currentPrice)
    })
    if (resultArray.length > 0) {
      futuresActivityData = [...resultArray, ...futuresActivityData]
      await saveFuturesData()
    }
    futuresPriceData = newPriceData
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const purgeData = () => {
  const currentTime = Date.now()
  spotActivityData = spotActivityData.filter((activity) => {
    return activity.time > currentTime - purgeDelta
  })
  saveSpotData()
  futuresActivityData = futuresActivityData.filter((activity) => {
    return activity.time > currentTime - purgeDelta
  })
  saveFuturesData()
}

await loadActivityData()
fetchSpotCoinList()
fetchFuturesCoinList()
setInterval(fetchSpotCoinList, coinListDelta)
setInterval(fetchFuturesCoinList, coinListDelta)
setInterval(fetchSpotMarketActivity, activityDelta)
setInterval(fetchFuturesMarketActivity, activityDelta)
setInterval(purgeData, purgeControlDelta)

app.get('/', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.status(200).send('Hello!')
})

app.get('/spot', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.status(200).send(spotActivityData)
})

app.get('/futures', function (_, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.status(200).send(futuresActivityData)
})

app.get('/logo', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url param')

  try {
    const response = await fetch(url)
    if (!response.ok) return res.status(500).send('Error fetching image')

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.set('Content-Type', 'image/png')
    res.set('Cache-Control', 'public, max-age=2592000, immutable')
    res.send(buffer)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching image')
  }
})

app.listen(5000, function () {})
