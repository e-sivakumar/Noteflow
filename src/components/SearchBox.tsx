// src/components/SearchDropdown.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDebouncedValue } from '../hooks/useDebounce';

export type SearchOption = { label: string; value: string, folderId?: string };

interface Props {
  options: SearchOption[];
  placeholder?: string;
  onSelect: (opt: SearchOption) => void;
  onSearch: (p: string)=> void
}

export default function SearchDropdown({
  options,
  placeholder = 'Search...',
  onSelect,
  onSearch
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debounce the user's input
  const debouncedQuery = useDebouncedValue(query, 300);
  const pageSize = 20;

  // Filter options based on debounced query
  // const filtered = useMemo(() => {
  //   if (debouncedQuery.length < 2) return [];
  //   onSearch(debouncedQuery.toLowerCase())
  //   return options
  // }, [debouncedQuery, options]);

  const filtered = useMemo(() => {
    return debouncedQuery.length < 2 ? [] : options
  }, [debouncedQuery, options])

  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (q.length >= 2) {
      onSearch(q)
      setVisibleCount(pageSize)
    }
  }, [debouncedQuery, onSearch])

  // const filtered = debouncedQuery.length < 2 ? [] : options;

  // Pagination for large lists
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visible = filtered.slice(0, visibleCount);

  // Reset visible count when filtered results change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filtered]);

  // Handle scroll for lazy loading
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
        setVisibleCount(c => Math.min(filtered.length, c + pageSize));
      }
    };
    
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [filtered]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Handle input focus
  const handleInputFocus = () => {
    setOpen(true);
  };

  // Handle option selection
  const handleOptionSelect = (option: SearchOption) => {
    onSelect(option);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      {/* Input Field */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 
                     rounded-lg shadow-sm
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-gray-300 dark:hover:border-gray-600
                     transition-all duration-200"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700 
                        rounded-lg shadow-lg z-50 overflow-hidden">
          
          {/* Header with results count */}
          {debouncedQuery.length >= 2 && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700/50 
                            border-b border-gray-100 dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Results
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 
                               px-2 py-1 rounded-full">
                {filtered.length}
              </span>
            </div>
          )}

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto px-0.5"
          >
            {/* Show message when query is too short */}
            {debouncedQuery.length < 2 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <FiSearch className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Type at least 2 characters to search</p>
              </div>
            )}

            {/* Show results */}
            {visible.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200
                           hover:bg-gray-50 dark:hover:bg-gray-700
                           focus:bg-gray-100 dark:focus:bg-gray-700
                           bg-gray-200 dark:bg-slate-800
                           my-0.5
                           focus:outline-none
                           transition-colors duration-150
                           border-b border-gray-50 dark:border-gray-700 last:border-b-0"
              >
                <span className="block truncate">{option.label}</span>
              </button>
            ))}

            {/* Loading indicator */}
            {debouncedQuery.length >= 2 && visible.length < filtered.length && (
              <div className="px-4 py-3 text-center">
                <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Loading more...
                </div>
              </div>
            )}

            {/* No results */}
            {debouncedQuery.length >= 2 && filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No results found</p>
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}