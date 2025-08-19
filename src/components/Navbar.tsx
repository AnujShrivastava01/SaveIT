import React from 'react';
import FancyThemeToggle from './FancyThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen } from 'lucide-react';

interface NavbarProps {
  children?: React.ReactNode;
  transparent?: boolean;
}

const Navbar = ({ children, transparent = false }: NavbarProps) => {
  const { theme } = useTheme();
  return (
    <nav
      className={
        `w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ` +
        (transparent
          ? 'bg-transparent backdrop-blur-xl border-b border-white/10 h-20'
          : theme === 'light'
            ? 'bg-white/40 backdrop-blur-2xl border-b border-white/30 shadow-xl h-20'
            : 'bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 shadow-xl h-20 text-white')
      }
      style={{ minHeight: 80, height: 80 }}
    >
      {/* Left: Logo and App Name */}
      <div className="flex items-center space-x-2 select-none">
        {/* App Icon with Sparkle */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:-rotate-6">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white z-10" />
          {/* Sparkle animation */}
          <svg className="absolute -top-1 -right-1 w-3 h-3 animate-sparkle z-20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#sparkle-glow)">
              <path d="M8 0L9.2 4.2L13.5 5L9.2 5.8L8 10L6.8 5.8L2.5 5L6.8 4.2L8 0Z" fill="#fff700"/>
            </g>
            <defs>
              <filter id="sparkle-glow" x="-2" y="-2" width="20" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        {/* Title and Subtitle stacked */}
        <div className="flex flex-col justify-center">
          <span className={`text-xl sm:text-2xl font-extrabold leading-tight ${theme === 'light' ? 'text-charcoal' : 'text-white'}`}>
            Save
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">It</span>
          </span>
          <span className={`hidden sm:block text-sm font-normal mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Your personal link & note organizer</span>
        </div>
      </div>
      {/* Right: Theme Toggle and children (Google/User icon area) */}
      <div className="flex items-center space-x-3">
        <FancyThemeToggle />
        {children}
      </div>
    </nav>
  );
};

export default Navbar; 