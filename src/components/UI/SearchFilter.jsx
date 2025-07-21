import React, { useState, memo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchFilter = memo(({ 
  filterFields = [], 
  onFilter, 
  onClear, 
  placeholder = "輸入搜尋內容...",
  disabled = false,
  keywordOnly = false
}) => {
  const [selectedField, setSelectedField] = useState(filterFields[0]?.value || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = () => {
    if (keywordOnly) {
      if (!searchTerm.trim()) return;
      onFilter({
        field: "keyword",
        value: searchTerm.trim()
      });
    } else {
      if (!selectedField || !searchTerm.trim()) return;
      onFilter({
        field: selectedField,
        value: searchTerm.trim()
      });
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (!keywordOnly) {
      setSelectedField(filterFields[0]?.value || "");
    }
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };

  return (
    <div className="search-filter-container">
      <div className="search-filter-wrapper">
        {!keywordOnly && (
          <select
            className="filter-field-select"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            disabled={disabled}
          >
            {filterFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        )}
        
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        
        <button
          className="filter-btn"
          onClick={handleFilter}
          disabled={disabled || !searchTerm.trim() || (!keywordOnly && !selectedField)}
          title="搜尋"
        >
          <FaSearch />
        </button>
        
        <button
          className="clear-btn"
          onClick={handleClear}
          disabled={disabled}
          title="清除篩選"
        >
          <FaTimes />
        </button>
      </div>

      <style jsx>{`
        .search-filter-container {
          margin-bottom: 20px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .search-filter-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-field-select {
          min-width: 140px;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-field-select:focus {
          outline: none;
          border-color: #4285f4;
        }

        .filter-field-select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #4285f4;
        }

        .search-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .filter-btn,
        .clear-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }

        .filter-btn {
          background: #4285f4;
          color: white;
        }

        .filter-btn:hover:not(:disabled) {
          background: #3367d6;
        }

        .filter-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .clear-btn {
          background: #f44336;
          color: white;
        }

        .clear-btn:hover:not(:disabled) {
          background: #d32f2f;
        }

        .clear-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .search-filter-wrapper {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-field-select,
          .search-input {
            min-width: auto;
            width: 100%;
          }

          .filter-btn,
          .clear-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
});

SearchFilter.displayName = "SearchFilter";

export default SearchFilter;