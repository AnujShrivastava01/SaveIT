import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FancyThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full border border-gray-300 bg-gray-200 dark:bg-gray-800 shadow-inner flex items-center transition-colors duration-500 focus:outline-none overflow-hidden"
      style={{ minWidth: 48, minHeight: 24 }}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600'}`}
      />
      {/* Stars for dark mode */}
      {isDark && (
        <svg className="absolute left-1 top-1" width="20" height="12">
          <circle cx="3" cy="3" r="0.5" fill="white" />
          <circle cx="10" cy="6" r="0.4" fill="white" />
          <circle cx="16" cy="2" r="0.4" fill="white" />
          <circle cx="13" cy="9" r="0.5" fill="white" />
        </svg>
      )}
      {/* Clouds for light mode */}
      {!isDark && (
        <svg className="absolute left-1 top-3" width="20" height="7">
          <ellipse cx="5" cy="3.5" rx="4" ry="2" fill="#fff" opacity="0.8" />
          <ellipse cx="10" cy="4" rx="3" ry="1.5" fill="#fff" opacity="0.7" />
          <ellipse cx="15" cy="3" rx="2.5" ry="1" fill="#fff" opacity="0.6" />
        </svg>
      )}
      {/* Sun and Moon toggle */}
      <div
        className={`absolute z-10 top-0.5 left-0.5 transition-transform duration-500 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
        style={{ willChange: 'transform' }}
      >
        {/* Sun */}
        {!isDark && (
          <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg border-2 border-yellow-300" />
        )}
        {/* Moon */}
        {isDark && (
          <div className="w-5 h-5 bg-gray-300 rounded-full shadow-lg border-2 border-gray-400 flex items-center justify-center relative">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full absolute left-1 top-1 opacity-70" />
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full absolute right-1 bottom-1 opacity-50" />
          </div>
        )}
      </div>
    </button>
  );
};

export default FancyThemeToggle; 