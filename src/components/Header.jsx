import { Button } from '@base-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMarketType } from '../utils/reduxStorage';
import { setMarketTypeStorage } from '../utils/localStorageUtils';

const Header = () => {
  const dispatch = useDispatch();
  const { marketType } = useSelector((state) => state.dataStore);

  const handleMarketChange = (type) => {
    dispatch(setMarketType(type));
    setMarketTypeStorage(type);
  };

  return (
    <header className="grid grid-cols-4 p-16">
      <Link className="col-span-1 flex items-center gap-8 text-white1" to="/">
        <img
          src="/android-chrome-192x192.png"
          width={40}
          height={40}
          alt="logo"
        />
        <div className="hidden md:block font-medium">CryptoPrices</div>
      </Link>

      <nav className="col-span-2 flex justify-center items-center gap-16">
        <Button
          onClick={() => handleMarketChange('spot')}
          className={`flex items-center gap-4 ${marketType === 'spot' ? 'text-white1 font-bold' : 'text-white-65 hover:text-white-80 transition-all duration-150 ease-in-out'}`}
        >
          <i className="fa-solid fa-chart-column"></i>
          Spot
        </Button>
        <Button
          onClick={() => handleMarketChange('futures')}
          className={`flex items-center gap-4 ${marketType === 'futures' ? 'text-white1 font-bold' : 'text-white-65 hover:text-white-80 transition-all duration-150 ease-in-out'}`}
        >
          <i className="fa-solid fa-chart-line"></i>
          Futures
        </Button>
      </nav>
    </header>
  );
};

export default Header;
