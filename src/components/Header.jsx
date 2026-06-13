const Header = () => {
  return (
    <header className="p-16">
      <a className="flex items-center gap-8 text-white1 w-fit" href="/">
        <img
          src="/android-chrome-192x192.png"
          width={40}
          height={40}
          alt="logo"
        />
        <div className="font-medium">CryptoPrices</div>
      </a>
    </header>
  );
};

export default Header;
