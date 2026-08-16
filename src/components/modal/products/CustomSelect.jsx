import React, { useState, useEffect, useRef } from 'react';

// Changed prop name from 'options' to 'items' to match dashboard context cleaner
export default function CustomSelect({ items = [], value, onChange, placeholder = '--' }) {  
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const checkSpace = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const expectedDropdownHeight = 240; 

      if (viewportHeight - rect.bottom < expectedDropdownHeight && rect.top > expectedDropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    };

    checkSpace();
    window.addEventListener('scroll', checkSpace);
    window.addEventListener('resize', checkSpace);

    return () => {
      window.removeEventListener('scroll', checkSpace);
      window.removeEventListener('resize', checkSpace);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Updated to search using .id instead of .value
  const selectedItem = items.find(item => item.id === value);

  return (
    <div className="custom-select" ref={containerRef}>
      <button 
        type="button" 
        className={`custom-select__trigger ${isOpen ? 'custom-select__trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 2. Updated to display .name instead of .label */}
        <span>{selectedItem ? selectedItem.name : placeholder}</span>
        <span className={`custom-select__arrow ${isOpen ? 'custom-select__arrow--rotated' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className={`custom-select__options custom-select__options--direction-${dropdownPosition}`}>
          {items.map((item) => (
            <li 
              key={item.id} // 3. Uses item.id as React list key
              className={`custom-select__option ${value === item.id ? 'custom-select__option--selected' : ''}`}
              onClick={() => {
                onChange(item.id); // 4. Returns item.id on user click selection
                setIsOpen(false);
              }}
            >
              {item.name} {/* 5. Renders item.name cleanly in centralized list format */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
