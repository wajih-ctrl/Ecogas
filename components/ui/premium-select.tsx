'use client';

import type { CSSProperties } from 'react';
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
  const [opensUpward, setOpensUpward] = useState(false);
  const [menuMaxHeight, setMenuMaxHeight] = useState(256);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  useEffect(() => {
    function updateMenuPosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isDesktop = window.matchMedia('(min-width: 640px)').matches;

      if (!isDesktop) {
        setOpensUpward(false);
        setMenuMaxHeight(Math.max(220, viewportHeight - 120));
        return;
      }

      const gutter = 16;
      const preferredHeight = searchable ? 336 : 272;
      const spaceBelow = viewportHeight - rect.bottom - gutter;
      const spaceAbove = rect.top - gutter;
      const shouldOpenUpward = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
      const availableSpace = shouldOpenUpward ? spaceAbove : spaceBelow;

      setOpensUpward(shouldOpenUpward);
      setMenuMaxHeight(Math.max(176, Math.min(preferredHeight, availableSpace)));
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      updateMenuPosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('scroll', updateMenuPosition, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updateMenuPosition);
        window.removeEventListener('scroll', updateMenuPosition, true);
      };
    }
  }, [isOpen, searchable]);

  const menuStyle = {
    '--select-menu-max-height': `${menuMaxHeight}px`,
    '--select-options-max-height': `${Math.max(128, menuMaxHeight - (searchable ? 74 : 0))}px`,
  } as CSSProperties;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full min-h-11 border rounded-xl text-left grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2.5 transition-all shadow-sm ${
            disabled
              ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-white border-slate-300 hover:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-[#14533b]'
          }`}
        >
          <span className={selectedOption ? 'min-w-0 text-slate-950 font-medium truncate' : 'min-w-0 text-slate-600 truncate'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 shrink-0 text-[#14533b] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close select menu"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] sm:hidden"
            />
            <div
              style={menuStyle}
              className={`fixed left-4 right-4 top-16 bottom-4 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:absolute sm:left-0 sm:right-0 sm:bottom-auto sm:max-h-[var(--select-menu-max-height)] sm:rounded-xl sm:shadow-[0_18px_45px_rgba(15,23,42,0.16)] ${
                opensUpward ? 'sm:top-auto sm:bottom-full sm:mb-2' : 'sm:top-full sm:mt-2'
              }`}
            >
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
            <div className="max-h-[54vh] overflow-y-auto overscroll-contain sm:max-h-[var(--select-options-max-height)]">
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
