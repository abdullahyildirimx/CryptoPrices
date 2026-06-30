import { Button, Input } from '@base-ui/react';
import { useState } from 'react';

const SearchBar = ({ handleSearch, id }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (value) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div
      className="
        flex items-center px-6 w-160 lg:w-200 h-32 md:h-35
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
          flex-1 min-w-0 px-6 text-[12px] md:text-[14px]
          placeholder:text-neutral-400
          caret-blue-500
          focus:outline-none
        "
      />

      {searchTerm && (
        <Button
          onClick={() => handleChange('')}
          className="
            flex items-center justify-center h-20 w-20
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
