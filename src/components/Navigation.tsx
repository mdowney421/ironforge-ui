import React from 'react';
import { ScreenType } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenNotifications?: () => void;
}

export const TopAppBar: React.FC<{
  title?: string;
  onNavigate?: (screen: ScreenType) => void;
  showBack?: boolean;
  onBack?: () => void;
}> = ({ title = 'IRONFORGE PRO', onNavigate, showBack, onBack }) => {
  return (
    <header className="bg-background dark:bg-background text-primary dark:text-primary w-full top-0 sticky border-b border-[#444933] flex justify-between items-center px-5 h-16 z-40 bg-[#131313]/95 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="text-primary hover:opacity-80 transition-opacity active:scale-95 p-1 -ml-1 rounded-full"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[26px]">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="hover:opacity-80 transition-opacity active:scale-95 hidden md:flex items-center text-[#c3f400]"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[28px]">fitness_center</span>
          </button>
        )}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="font-headline font-bold text-xl md:text-2xl tracking-tighter text-white cursor-pointer select-none uppercase flex items-center gap-2"
        >
          {title}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop Quick Nav Links */}
        <div className="hidden md:flex items-center gap-1 mr-3 bg-[#1c1b1b] border border-[#353534] rounded-full p-1 text-xs font-mono">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="px-3 py-1 rounded-full text-[#e5e2e1] hover:text-[#c3f400] transition-colors"
          >
            DASHBOARD
          </button>
          <button
            onClick={() => onNavigate && onNavigate('create_workout')}
            className="px-3 py-1 rounded-full text-[#e5e2e1] hover:text-[#c3f400] transition-colors"
          >
            BUILDER
          </button>
          <button
            onClick={() => onNavigate && onNavigate('history')}
            className="px-3 py-1 rounded-full text-[#e5e2e1] hover:text-[#c3f400] transition-colors"
          >
            ANALYTICS
          </button>
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="px-3 py-1 rounded-full text-[#e5e2e1] hover:text-[#c3f400] transition-colors"
          >
            ATHLETE
          </button>
        </div>

        <button
          onClick={() => alert("Notification Protocol: All metrics in synchronization. Next scheduled training: Push Day.")}
          className="material-symbols-outlined hover:opacity-80 transition-opacity active:scale-95 text-white p-2 rounded-full hover:bg-[#201f1f]"
          aria-label="Notifications"
        >
          notifications
        </button>
      </div>
    </header>
  );
};

export const BottomNavBar: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  // If in welcome screen or active workout fullscreen, bottom nav is hidden
  if (currentScreen === 'welcome' || currentScreen === 'active_workout') {
    return null;
  }

  return (
    <nav className="bg-[#131313] dark:bg-[#131313] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-2 border-t border-[#444933] md:hidden">
      {/* Home / Dashboard */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 py-1 ${
          currentScreen === 'dashboard'
            ? 'text-[#c3f400] bg-[#353534] rounded-full px-4'
            : 'text-[#c4c9ac] hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={currentScreen === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          home
        </span>
        <span className="font-label-caps text-[11px] tracking-wider mt-0.5">Home</span>
      </button>

      {/* Workouts / Builder */}
      <button
        onClick={() => onNavigate('create_workout')}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 py-1 ${
          currentScreen === 'create_workout'
            ? 'text-[#c3f400] bg-[#353534] rounded-full px-4'
            : 'text-[#c4c9ac] hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={currentScreen === 'create_workout' ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          fitness_center
        </span>
        <span className="font-label-caps text-[11px] tracking-wider mt-0.5">Workouts</span>
      </button>

      {/* History / Analytics */}
      <button
        onClick={() => onNavigate('history')}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 py-1 ${
          currentScreen === 'history'
            ? 'text-[#c3f400] bg-[#353534] rounded-full px-4'
            : 'text-[#c4c9ac] hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={currentScreen === 'history' ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          history
        </span>
        <span className="font-label-caps text-[11px] tracking-wider mt-0.5">History</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 py-1 ${
          currentScreen === 'profile'
            ? 'text-[#c3f400] bg-[#353534] rounded-full px-4'
            : 'text-[#c4c9ac] hover:text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={currentScreen === 'profile' ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          person
        </span>
        <span className="font-label-caps text-[11px] tracking-wider mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
