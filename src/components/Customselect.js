import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';


export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Choisissez...",
  label,
  badgeNumber,
  badgeColor = "amber",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const colorClasses = {
    amber: {
      badge: 'bg-gradient-to-br from-amber-500 to-amber-600',
      border: 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/20',
      option: 'hover:bg-amber-50 text-amber-700',
      selected: 'bg-amber-100 text-amber-900'
    },
    emerald: {
      badge: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      border: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20',
      option: 'hover:bg-emerald-50 text-emerald-700',
      selected: 'bg-emerald-100 text-emerald-900'
    },
    blue: {
      badge: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500/20',
      option: 'hover:bg-blue-50 text-blue-700',
      selected: 'bg-blue-100 text-blue-900'
    }
  };

  const colors = colorClasses[badgeColor] || colorClasses.amber;

  return (
    <div className="space-y-3 w-full max-w-full" ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block">
          <span className="inline-flex items-center gap-2 sm:gap-3 text-gray-900 font-bold text-sm sm:text-base lg:text-lg mb-3">
            <span className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 ${colors.badge} text-white rounded-xl text-xs sm:text-sm font-black shadow-lg flex-shrink-0`}>
              {badgeNumber}
            </span>
            <span className="leading-tight">{label}</span>
          </span>
        </label>
      )}

      {/* Custom Select Button */}
      <div className="relative max-w-full">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full max-w-full px-3 sm:px-4 lg:px-6 py-3.5 sm:py-4 lg:py-5 border-2 ${colors.border} rounded-xl sm:rounded-2xl focus:ring-4 bg-white/80 backdrop-blur-sm transition-all text-xs sm:text-sm lg:text-base font-medium cursor-pointer text-left flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={`truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            size={18} 
            className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-slide-down">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Aucune option disponible
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 sm:px-4 py-3 text-left transition-all flex items-center justify-between gap-2 border-b border-gray-100 last:border-b-0 ${
                    option.value === value
                      ? colors.selected
                      : colors.option
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check size={16} className="flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Badge */}
      {selectedOption && (
        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${colors.selected} border ${colors.border} rounded-xl max-w-full overflow-hidden`}>
          <span className={`${colors.option} font-black text-xs sm:text-sm flex-shrink-0`}>✓</span>
          <span className={`text-xs sm:text-sm font-semibold ${colors.option} truncate`}>
            {selectedOption.label}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}