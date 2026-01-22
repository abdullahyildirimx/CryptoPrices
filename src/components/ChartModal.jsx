import { Dialog } from '@base-ui/react/dialog'
import { useState } from 'react'

const ChartModal = ({ isOpen, onOpenChange, selectedCoin, isSpot }) => {
  const [loading, setLoading] = useState(true)

  const COIN_NAME_MAP = {
    币安人生: 'BIANRENSHENG',
    我踏马来了: 'WOTAMALAILIAO',
  }

  const normalizeCoinName = (coin) => {
    return COIN_NAME_MAP[coin] ?? coin
  }

  const handleOpenChange = (open) => {
    if (!open) setLoading(true)
    onOpenChange(open)
  }

  const convertedCoin = normalizeCoinName(selectedCoin)
  const symbol = convertedCoin
    ? isSpot
      ? `BINANCE:${convertedCoin.toUpperCase()}USDT`
      : `BINANCE:${convertedCoin.toUpperCase()}USDT.P`
    : ''
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Popup
          initialFocus={false}
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[90vw] max-w-1200 bg-black
            rounded-lg border border-grey2
            text-white1
          "
        >
          <div className="flex items-center justify-between px-24 py-16 border-b border-neutral-800">
            <Dialog.Title className="text-[20px] font-medium">
              {selectedCoin ? `${selectedCoin} Chart` : 'Chart'}
            </Dialog.Title>
            <Dialog.Close className="p-8 rounded-md">
              <i className="fa-solid fa-xmark text-[16px]" />
            </Dialog.Close>
          </div>
          <div className="p-24 w-full h-400 md:h-500 relative">
            {selectedCoin ? (
              <>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <iframe
                  className="w-full h-full"
                  src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=1&theme=dark&timezone=${timezone}`}
                  allowFullScreen
                  title={`${selectedCoin} Chart`}
                  onLoad={() => setLoading(false)}
                />
              </>
            ) : (
              <div className="p-24 text-center text-neutral-400">
                No asset selected
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ChartModal
