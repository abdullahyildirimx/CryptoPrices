import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFuturesCoinData,
  setFuturesCoinMetadata,
} from '../utils/reduxStorage'
import {
  futuresPriceUrl,
  futuresExchangeInfoUrl,
  coinLogosUrl,
} from '../utils/urls'

const useFuturesData = () => {
  const { futuresCoinMetadata } = useSelector((state) => state.dataStore)
  const [coinMetadata, setCoinMetadata] = useState(futuresCoinMetadata || null)
  const dispatch = useDispatch()

  const countDecimalPlaces = (num) => {
    let reduced = parseFloat(num)
    if (parseFloat(num) >= 1) {
      return 0
    }
    reduced = reduced.toString()
    if (reduced === '1e-7') {
      return 7
    }
    if (reduced === '1e-8') {
      return 8
    }
    return reduced.split('.')[1].length
  }

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(futuresPriceUrl)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const jsonData = await response.json()
        const currentTime = Date.now()
        const filteredCoins = jsonData.filter((coin) => {
          return (
            coin.symbol.endsWith('USDT') &&
            currentTime <= coin.closeTime + 1800000
          )
        })

        const priceList = filteredCoins.map((coin) => {
          const symbol = coin.symbol.slice(0, -'USDT'.length)
          let price = coin.lastPrice
          const volume = coin.quoteVolume
          const change = coin.priceChangePercent
          const currency = '$'
          let logo = null
          let tickSize = null

          if (coinMetadata) {
            let metadata = coinMetadata.find((coin) => coin.symbol === symbol)
            if (metadata) {
              const tickSizeDecimals = metadata.tickSize
              price = parseFloat(price).toFixed(tickSizeDecimals)
              logo = metadata.logo
              tickSize = metadata.tickSize
            }
          } else {
            price = parseFloat(price)
          }

          return {
            symbol: symbol,
            price: price,
            volume: volume,
            change: change,
            currency: currency,
            logo: logo,
            tickSize: tickSize,
          }
        })
        dispatch(setFuturesCoinData(priceList))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchPriceData()
    const intervalId = setInterval(fetchPriceData, 5000)
    return () => clearInterval(intervalId)
  }, [coinMetadata, dispatch])

  useEffect(() => {
    if (futuresCoinMetadata) return

    const fetchCoinMetadata = async () => {
      try {
        const response = await fetch(futuresExchangeInfoUrl)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const jsonData = await response.json()

        const response2 = await fetch(coinLogosUrl)
        if (!response2.ok) {
          throw new Error('Network response was not ok')
        }
        const jsonData2 = await response2.json()
        const logoData = jsonData2.data

        const filteredCoins = jsonData.symbols.filter((coin) => {
          return coin.symbol.endsWith('USDT') && coin.status === 'TRADING'
        })

        const coinMetadata = filteredCoins
          .map((item) => {
            const symbol = item.symbol.slice(0, -'USDT'.length)
            let tickSize = countDecimalPlaces(item.filters[0].tickSize)
            let logo
            logo = logoData.find((coin) => coin?.asset === symbol)?.logo
            return {
              symbol: symbol,
              tickSize: tickSize,
              logo: logo,
            }
          })
          .slice()
          .sort((a, b) => {
            return a.symbol.localeCompare(b.symbol)
          })

        setCoinMetadata(coinMetadata)
        dispatch(setFuturesCoinMetadata(coinMetadata))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchCoinMetadata()
  }, [futuresCoinMetadata, dispatch])
}

export default useFuturesData
