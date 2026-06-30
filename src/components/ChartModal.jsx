import { Button, Dialog } from '@base-ui/react';
import { useState } from 'react';

const ChartModal = ({ isOpen, onOpenChange, selectedCoin }) => {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const COIN_NAME_MAP = {
    币安人生: 'BIANRENSHENG',
    我踏马来了: 'WOTAMALAILIAO',
    龙虾: 'LONGXIA',
  };

  const normalizeCoinName = (coin) => {
    return COIN_NAME_MAP[coin] ?? coin;
  };

  const handleOpenChange = (open) => {
    if (!open) setLoading(true);
    onOpenChange(open);
  };

  const handleCopyLink = async () => {
    if (!selectedCoin) return;

    const url = `${window.location.origin}${window.location.pathname}?coin=${selectedCoin.toUpperCase()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const convertedCoin = normalizeCoinName(selectedCoin)?.toUpperCase();
  const symbol = convertedCoin ? `BINANCE:${convertedCoin}USDT.P` : '';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Popup
          initialFocus={false}
          className="
            fixed flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[90vw] max-w-1200 h-[80vh] max-h-500 md:max-h-600 bg-black
            rounded-lg border border-grey2
            text-white1
          "
        >
          <div className="flex items-center justify-between px-24 py-16 border-b border-neutral-800">
            <div className="flex items-center gap-6">
              <Dialog.Title className="text-[16px] md:text-[20px] font-medium">
                {selectedCoin ? `${selectedCoin.toUpperCase()} Chart` : 'Chart'}
              </Dialog.Title>
              {selectedCoin && (
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center w-120 md:w-135 gap-6 text-[12px] md:text-[14px] rounded-md px-8 py-6 text-white-65 hover:text-white1 transition-all duration-150 ease-in-out"
                >
                  <i className="fa-solid fa-link" />
                  {copied ? 'Copied!' : 'Copy chart link'}
                </Button>
              )}
            </div>
            <Dialog.Close className="p-8 rounded-md">
              <i className="fa-solid fa-xmark text-[16px]" />
            </Dialog.Close>
          </div>
          <div className="p-24 w-full flex-1 relative">
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
  );
};

export default ChartModal;
