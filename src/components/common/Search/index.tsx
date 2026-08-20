import React, { useEffect, useState } from 'react';
import Styles from './styles.module.css';
import Button from '../Button';

interface SearchProps {
  value: string;
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const Search: React.FC<SearchProps> = ({
  value,
  onSearch,
  placeholder = 'Pesquisar...',
  debounceTime = 300,
}) => {
  const [intervalValue, setIntervalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(intervalValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [intervalValue, debounceTime, onSearch]);

  const handleClear = () => {
    setIntervalValue('');
    onSearch('');
  };

  return (
    <>
      <div className={Styles.searchWrapper}>
        <input
          type='text'
          value={intervalValue}
          onChange={e => setIntervalValue(e.target.value)}
          placeholder={placeholder}
          className={Styles.searchInput}
        />
        {intervalValue && (
          <Button
            onClick={handleClear}
            className={Styles.clearButton}
            arial-label='Limpar busca'
          >
            x
          </Button>
        )}
      </div>
    </>
  );
};

export default Search;
