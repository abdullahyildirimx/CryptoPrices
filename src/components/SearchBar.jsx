import { Button, Input } from '@base-ui/react';
import { useState } from 'react';

const SearchBar = ({ handleSearch, id }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (value) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    handleSearch('');
  };

  return (
    <div
      className="
        relative w-160 lg:w-200 h-32 md:h-35
        border border-grey2 rounded-md
        transition-all duration-150 ease-in-out
        hover:border-blue-500
        focus-within:border-blue-500
        [&:has(button:hover)]:border-blue-500
      "
    >
      <Input
        id={id}
        value={searchTerm}
        onValueChange={(value) => handleChange(value)}
        placeholder="Search"
        autoComplete="off"
        className="
          text-[12px] md:text-[14px]
          w-130 lg:w-170
          py-6 pr-8 pl-12
          placeholder:text-neutral-400
          caret-blue-500
          focus:outline-none
        "
      />

      {searchTerm && (
        <Button
          onClick={handleClear}
          className="
            absolute top-5 md:top-6.5 right-6
            flex items-center justify-center
            h-20 w-20
            rounded-full
            text-grey1 hover:text-blue-500
          "
        >
          <i className="fa-solid fa-xmark text-[10px] md:text-[12px]" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
