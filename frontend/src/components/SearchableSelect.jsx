import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './SearchableSelect.css';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Determine what to show in the input box (value or search term)
        if (!isOpen) {
            setSearchTerm(value || '');
        }
    }, [value, isOpen]);

    useEffect(() => {
        // Filter options based on search term when open
        if (isOpen) {
            if (searchTerm === value) {
                setFilteredOptions(options); // Show all if term matches value exactly (initial open)
            } else {
                setFilteredOptions(
                    options.filter(opt =>
                        opt.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            }
        }
    }, [searchTerm, options, isOpen, value]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(value || ''); // Revert to selected value
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const handleSelect = (option) => {
        onChange(option);
        setSearchTerm(option);
        setIsOpen(false);
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className={`searchable-select ${disabled ? 'disabled' : ''}`} ref={wrapperRef}>
            <div
                className="select-input-wrapper"
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    className="select-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    disabled={disabled}
                />
                <div className="select-icons">
                    {value && !disabled && (
                        <X size={16} className="clear-icon" onClick={clearSelection} />
                    )}
                    <ChevronDown size={16} className="chevron-icon" />
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className="options-list">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt, index) => (
                            <li
                                key={index}
                                className={`option-item ${opt === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(opt)}
                            >
                                {opt}
                            </li>
                        ))
                    ) : (
                        <li className="option-item no-results">No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
