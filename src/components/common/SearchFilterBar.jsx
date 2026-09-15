import { RefreshCcw, Search } from "feather-icons-react";

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onSort,
  placeholder = "Search here...",
}) => {
  return (
    <div className="search-filter-container">
      {onRefresh && <RefreshCcw
        color="#4F4F4F"
        size={20}
        className="filter-icon-btn"
        onClick={onRefresh}
      />}

      {onSort && <svg xmlns="http://www.w3.org/2000/svg"
        onClick={onSort}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4F4F4F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="filter-icon-btn"
      >
        <path d="m21 16-4 4-4-4" />
        <path d="M17 20V4" />
        <path d="m3 8 4-4 4 4" />
        <path d="M7 4v16" />
      </svg>}

      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="search-input-field"
        />
        <Search className="search-icon" color="#BDBDBD" size={20} />

      </div>
    </div>
  );
};

export default SearchFilterBar;
