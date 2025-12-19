import React, { useEffect, useRef, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

type Props = {
  value?: string;
  onSearch: (q: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
};

const SearchBar: React.FC<Props> = ({ value = '', onSearch, placeholder = 'Search...', debounceMs = 250, minChars = 0 }) => {
  const [input, setInput] = useState<string>(value);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      const q = input.trim();
      if (q.length >= minChars) {
        onSearch(q);
      } else if (q.length === 0) {
        onSearch('');
      }
    }, debounceMs) as unknown as number;

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [input, debounceMs, minChars, onSearch]);

  const clear = () => {
    setInput('');
    onSearch('');
  };

  return (
    <div className="searchbar" role="search">
      <FiSearch className="searchbar-icon" />
      <input
        type="search"
        className="searchbar-input"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label={placeholder}
      />
      {input.length > 0 && (
        <button type="button" className="searchbar-clear" onClick={clear} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
