import React from 'react';
import { Search, X } from 'lucide-react';
import './styles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="search-bar-container">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button className="clear-button" onClick={() => onChange({ target: { value: '' } })}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;