'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  label,
  searchable = true,
  disabled = false,
  className = '',
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full min-h-11 px-4 py-2.5 border rounded-xl text-left flex items-center justify-between transition-all shadow-sm ${
            disabled
              ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-white border-slate-300 hover:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-[#14533b]'
          }`}
        >
          <span className={selectedOption ? 'text-slate-950 font-medium truncate' : 'text-slate-600 truncate'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#14533b] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close select menu"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent sm:hidden"
            />
            <div className="fixed left-4 right-4 bottom-4 z-50 max-h-[72vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:absolute sm:top-full sm:left-0 sm:right-0 sm:bottom-auto sm:mt-2 sm:max-h-none sm:rounded-xl sm:shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            {searchable && (
              <div className="p-3 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4"
                  />
                </div>
              </div>
            )}
            <div className="max-h-[54vh] overflow-y-auto overscroll-contain sm:max-h-64">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      value === option.value
                        ? 'bg-emerald-50 text-[#14533b] font-semibold'
                        : 'bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
