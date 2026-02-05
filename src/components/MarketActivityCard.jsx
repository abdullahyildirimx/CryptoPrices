import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import {
  getFuturesMarketActivityStorage,
  setFuturesMarketActivityStorage,
  getSpotMarketActivityStorage,
  setSpotMarketActivityStorage,
} from '../utils/localStorageUtils'
import MarketActivity from './MarketActivity'
import { getLogoFromUrl } from '../utils/urls'
import { Checkbox } from '@base-ui/react'
import SearchBar from './SearchBar'

const MarketActivityCard = ({ isSpot = false }) => {
  const localStorageActivity = isSpot
    ? getSpotMarketActivityStorage()
    : getFuturesMarketActivityStorage()
  const [showFavorites, setShowFavorites] = useState(
    localStorageActivity?.showFavorites || false,
  )
  const [searchedCoins, setSearchedCoins] = useState(null)
  const {
    spotCoinData,
    spotMarketActivity,
    spotFavoriteCoins,
    futuresCoinData,
    futuresMarketActivity,
    futuresFavoriteCoins,
  } = useSelector((state) => state.dataStore)
  const selectedCoinData = isSpot ? spotCoinData : futuresCoinData
  const selectedMarketActivity = isSpot
    ? spotMarketActivity
    : futuresMarketActivity
  const selectedFavoriteCoins = isSpot
    ? spotFavoriteCoins
    : futuresFavoriteCoins

  const handleToggleFavorites = (newValue) => {
    setShowFavorites(newValue)
    if (isSpot) {
      setSpotMarketActivityStorage('showFavorites', newValue)
    } else {
      setFuturesMarketActivityStorage('showFavorites', newValue)
    }
  }

  const getLogo = (symbol) => {
    const url = selectedCoinData?.find((data) => data.symbol === symbol)?.logo
    return url ? getLogoFromUrl(url) : '/genericicon.png'
  }

  const formatPrice = (symbol, price) => {
    const tickSize = selectedCoinData?.find(
      (data) => data.symbol === symbol,
    )?.tickSize
    return tickSize ? parseFloat(price).toFixed(tickSize) : price
  }

  const filterActivities = () => {
    if (!selectedMarketActivity) return []

    const base = searchedCoins
      ? selectedMarketActivity.filter((item) =>
          searchedCoins.includes(item.symbol),
        )
      : showFavorites
        ? selectedMarketActivity.filter((item) =>
            selectedFavoriteCoins.includes(item.symbol),
          )
        : selectedMarketActivity.slice(0, 1000)
    return base.map((item) => ({
      ...item,
      oldPrice: formatPrice(item.symbol, item.oldPrice),
      newPrice: formatPrice(item.symbol, item.newPrice),
      logo: getLogo(item.symbol),
    }))
  }

  const handleSearch = (value) => {
    if (!selectedMarketActivity) return []

    if (value) {
      const filteredResults = Array.from(
        new Set(
          selectedMarketActivity
            .filter((item) =>
              item.symbol.toLowerCase().includes(value.toLowerCase()),
            )
            .map((item) => item.symbol),
        ),
      )
      setSearchedCoins(filteredResults)
    } else {
      setSearchedCoins(null)
    }
  }

  const activity = filterActivities()

  return (
    <div className="p-8">
      <div className="bg-black1 rounded-2xl p-16 text-white1 text-[14px] font-medium border border-grey2">
        <div className={`flex flex-col justify-between`}>
          <div className="flex justify-between mb-14">
            <div className="hidden lg:flex items-center gap-4">
              <h1 className="hidden lg:block text-[20px]/[35px]">
                {isSpot ? 'Spot Market Activity' : 'Futures Market Activity'}
              </h1>
              <i
                className="hidden lg:block fa-regular fa-circle-question"
                data-tooltip-id="infoTooltip1"
              ></i>
            </div>
            <div className="lg:hidden flex flex-col">
              <h1 className="lg:hidden text-[18px]/[24px] lg:text-[20px]/[35px]">
                {isSpot ? 'Spot Market' : 'Futures Market'}
              </h1>
              <div className="flex items-center gap-4">
                <h1 className="lg:hidden text-[18px]/[24px]">Activity</h1>
                <i
                  className="hidden lg:block fa-regular fa-circle-question"
                  data-tooltip-id="infoTooltip1"
                ></i>
              </div>
            </div>
            <SearchBar handleSearch={handleSearch} id={'searchActivity'} />
          </div>
          <div className="flex items-center mb-14 gap-4">
            <label className="flex items-center gap-4 h-24">
              <Checkbox.Root
                aria-label="Show only favorites"
                className="
                  w-14 h-14 rounded-sm border border-grey2 
                  data-checked:border-blue-500 data-checked:bg-blue-500
                  flex items-center justify-center
                  transition-all duration-150 ease-in-out cursor-pointer
                  hover:border-blue-500
                "
                checked={showFavorites}
                onCheckedChange={(value) => handleToggleFavorites(value)}
              >
                <Checkbox.Indicator>
                  <i className="fa-solid fa-check text-[10px]" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              Show only favorites
            </label>
            <i
              className="fa-regular fa-circle-question"
              data-tooltip-id="infoTooltip2"
            ></i>
          </div>
        </div>
        <Tooltip
          className="w-200! bg-black! opacity-100!"
          id="infoTooltip1"
          place="bottom"
          variant="dark"
          content="5 minutes unusual price activity. For BTC, ETH, USDT, XAU and XAG, it is triggered when price is changed over 1%, for other coins it is 3%."
        />
        <Tooltip
          className="w-200! bg-black! opacity-100!"
          id="infoTooltip2"
          place="bottom"
          variant="dark"
          content="If 'Show only favorites' is unchecked, you may see many activities. The latest maximum of 1000 activities is displayed at once."
        />
        <div
          className={`h-275 md:h-[calc(100vh-242px)] lg:h-[calc(100vh-229px)] text-[12px] md:text-[14px] overflow-y-auto ${!activity.length ? 'flex justify-center items-center' : ''}`}
        >
          {selectedMarketActivity ? (
            <>
              <MarketActivity activity={activity} isSpot={isSpot} />
              {!activity.length &&
                (showFavorites ? (
                  <p>There is no market activity for your favorite coins.</p>
                ) : (
                  <p>There is no market activity.</p>
                ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-36 h-36 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketActivityCard
