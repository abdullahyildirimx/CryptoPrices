import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <header className="grid grid-cols-4 p-16">
      <Link
        className="col-span-1 flex items-center gap-8 text-white1 w-fit"
        to="/"
      >
        <img
          src="/android-chrome-192x192.png"
          width={40}
          height={40}
          alt="logo"
        />
        <div className="font-medium">CryptoPrices</div>
      </Link>
    </header>
  );
};

export default Header;
