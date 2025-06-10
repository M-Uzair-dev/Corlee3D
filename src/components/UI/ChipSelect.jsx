import React, { useState, useRef, useEffect } from 'react';
import './ChipSelect.css';

const ChipSelect = ({ 
  options, 
  value = [], 
  onChange, 
  placeholder = "Select...",
  className = "",
  error = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChipRemove = (optionId) => {
    const newValue = value.filter(id => id !== optionId);
    onChange(newValue);
  };

  const handleOptionClick = (optionId) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(option.id)
  );

  return (
    <div 
      ref={containerRef} 
      className={`chip-select-container ${error ? 'error' : ''} ${className}`}
    >
      <div 
        className={`chip-select-input ${isOpen ? 'focused' : ''}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="chips-container">
          {value.map(selectedId => {
            const option = options.find(opt => opt.id === selectedId);
            if (!option) return null;
            return (
              <div key={option.id} className="chip">
                {option.name}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChipRemove(option.id);
                    }}
                    className="chip-remove"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          {!disabled && (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={value.length === 0 ? placeholder : ''}
              className="chip-input"
            />
          )}
        </div>
      </div>
      {isOpen && !disabled && (
        <div className="chip-select-dropdown">
          {filteredOptions.length === 0 ? (
            <div className="no-options">No options found</div>
          ) : (
            filteredOptions.map(option => (
              <div
                key={option.id}
                className="dropdown-option"
                onClick={() => handleOptionClick(option.id)}
              >
                {option.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChipSelect;
