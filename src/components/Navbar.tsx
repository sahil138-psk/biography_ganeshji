import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  Bell,
  Sparkles,
  BookOpen,
  Compass,
  Flame,
  Award,
  Menu,
  X,
  Volume2
} from 'lucide-react';
import { playTempleBell } from '../utils/audioSynthesizer';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBlessing: () => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenBlessing }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; marathi: string; icon: React.ReactNode }[] = [
    { id: 'darshan', label: 'Divine Darshan', marathi: 'दर्शन मंडप', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'birth-story', label: 'Sacred Biography', marathi: 'जन्म कथा', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'ashtavinayak', label: '8 Ashtavinayak', marathi: 'अष्टविनायक', icon: <Compass className="w-4 h-4" /> },
    { id: 'mantra-108', label: '108 Mantra Japa', marathi: '१०८ नाम जप', icon: <span className="text-xs">📿</span> },
    { id: 'aartis', label: 'Aarti Sanctuary', marathi: 'आरती संग्रह', icon: <Flame className="w-4 h-4" /> },
    { id: 'dhol-tasha', label: 'Dhol Tasha Jam', marathi: 'ढोल ताशा पथक', icon: <span className="text-xs">🥁</span> },
    { id: 'blessing-card', label: 'E-Blessing Card', marathi: 'दर्शन पत्रिका', icon: <span className="text-xs">🪷</span> },
    { id: 'quiz', label: 'Ganesh Quiz', marathi: 'ज्ञान परीक्षा', icon: <Award className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleTabClick('darshan')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-amber-300">
              <span className="font-devanagari text-2xl font-bold">ॐ</span>
            </div>
            <div>
              <div className="font-serif-sacred font-extrabold text-base sm:text-lg text-stone-900 leading-tight">
                श्री गणेश दर्शन
              </div>
              <div className="text-[11px] font-semibold text-amber-700 tracking-wider">
                Biography • Ashtavinayak • 108 Mantras
              </div>
            </div>
          </button>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-amber-100 text-amber-950 shadow-sm border border-amber-300'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-amber-50'
                  }`}
                >
                  <span className={isActive ? 'text-amber-700' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Daily Modak Blessing Trigger */}
            <button
              id="open-blessing-btn"
              onClick={onOpenBlessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow hover:shadow-md transition-all active:scale-95"
              title="Open Daily Modak of Wisdom"
            >
              <span>🥟</span>
              <span className="hidden sm:inline">Daily Blessing</span>
            </button>

            {/* Quick Temple Bell Trigger */}
            <button
              onClick={() => playTempleBell(1.1)}
              className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all active:scale-90"
              title="Ring Temple Bell"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 border border-amber-300'
                    : 'text-stone-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-600">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="font-devanagari text-[11px] text-amber-700/80">
                  {item.marathi}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
