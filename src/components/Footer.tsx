import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { playTempleBell } from '../utils/audioSynthesizer';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-amber-500 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Shlok Inscription Banner */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-amber-400 font-devanagari text-xl sm:text-2xl font-bold">
            ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
          </div>
          <p className="text-xs text-stone-400 italic">
            “O Lord with the curved trunk and immense aura like millions of suns, please make all my endeavors free from obstacles, always.”
          </p>
        </div>

        <div className="w-full h-px bg-stone-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-devanagari font-bold text-base border border-amber-500/40">
              ॐ
            </span>
            <div>
              <span className="font-bold text-stone-200">Shree Ganesh Darshan & Ashtavinayak</span>
              <span className="block text-[11px] text-stone-500">Dedicated to the Glory of Lord Ganesha</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playTempleBell(1.2)}
              className="text-amber-400 hover:text-amber-300 transition-colors font-semibold"
            >
              🔔 Ring Temple Bell
            </button>
            <span>•</span>
            <span className="text-stone-500">Ganpati Bappa Morya! Mangal Murti Morya!</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
