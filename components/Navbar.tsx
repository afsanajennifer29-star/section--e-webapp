
import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isPremium: boolean;
  onOpenVIP: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange, isPremium, onOpenVIP }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeSwitch = (mode: ViewMode) => {
    onViewChange(mode);
    setIsDropdownOpen(false);
  };

  const isStream = activeView === ViewMode.ENTERTAINMENT;

  return (
    <nav className="sticky top-0 z-[60] bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-3 sm:px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3 sm:space-x-6">
        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => onViewChange(ViewMode.ENTERTAINMENT)}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-violet-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-md">
              <path d="M19 12L5 21V3L19 12Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <rect x="7" y="7" width="4" height="10" rx="1" fill="white" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-white bg-clip-text text-transparent tracking-tighter hidden xs:block">
            Section E
          </h1>
        </div>
        
        {/* Mode Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 border ${
              isStream 
              ? 'bg-violet-600/10 border-violet-500/30 text-violet-400' 
              : 'bg-teal-600/10 border-teal-500/30 text-teal-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${isStream ? 'bg-violet-500' : 'bg-teal-500'}`}></div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
              {isStream ? 'Stream Mode' : 'Focus Mode'}
            </span>
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => handleModeSwitch(ViewMode.ENTERTAINMENT)}
                className={`w-full flex items-center space-x-3 p-4 text-left transition-colors ${
                  isStream ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-play text-xs"></i>
                <div>
                   <p className="text-xs font-black uppercase tracking-tight">Entertainment</p>
                   <p className="text-[8px] opacity-60 font-bold">Watch Dramas & Anime</p>
                </div>
              </button>
              <button
                onClick={() => handleModeSwitch(ViewMode.STUDY)}
                className={`w-full flex items-center space-x-3 p-4 text-left transition-colors ${
                  !isStream ? 'bg-teal-600/20 text-teal-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-book-open text-xs"></i>
                <div>
                   <p className="text-xs font-black uppercase tracking-tight">Study Mode</p>
                   <p className="text-[8px] opacity-60 font-bold">Focus & AI Tutoring</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {!isPremium ? (
          <button 
            onClick={onOpenVIP}
            className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black rounded-lg text-[9px] sm:text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/20"
          >
            <i className="fa-solid fa-gem text-[9px]"></i>
            <span className="hidden xs:inline">VIP</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-violet-600/10 border border-violet-500/50 text-violet-400 font-black rounded-lg text-[8px] sm:text-[10px] uppercase tracking-tighter sm:tracking-[0.2em]">
            <i className="fa-solid fa-crown"></i>
            <span className="hidden xs:inline">Premium</span>
          </div>
        )}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-800">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Status</p>
            <p className="text-xs font-bold text-violet-400">Streamer_01</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-600 border-2 border-white/20 flex items-center justify-center cursor-pointer overflow-hidden ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-900 hover:ring-violet-500 transition-all">
            <img src="https://picsum.photos/seed/sectione/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
