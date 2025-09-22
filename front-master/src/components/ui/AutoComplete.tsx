import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface AutoCompleteOption {
  value: string;
  label: string;
}

interface AutoCompleteProps {
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  options: AutoCompleteOption[];
  loading?: boolean;
  className?: string;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  label,
  error,
  helpText,
  placeholder,
  value,
  onChange,
  onSearch,
  options,
  loading = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== value) {
        onSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, value, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: AutoCompleteOption) => {
    setQuery(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const inputId = `autocomplete-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={clsx(
            'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 placeholder-gray-400'
          )}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        />

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {loading ? (
              <div className="px-3 py-2 text-gray-500">
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando...
                </div>
              </div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">No se encontraron resultados</div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white"
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};