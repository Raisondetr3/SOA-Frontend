import React, { useState } from 'react';
import searchIcon from '../../assets/search-icon.svg';
import './SearchBar.css';

const SearchBar = ({ placeholder, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="search-bar">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchBar;
