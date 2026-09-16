import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  Search,
  CheckCircle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { MANTRAS_108 } from '../data/mantras108Data';
import { playTempleBell, playCymbal, devotionalVoiceReciter } from '../utils/audioSynthesizer';

export const MantraJapaCounter: React.FC = () => {
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [malasCompleted, setMalasCompleted] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('japa_malas_completed');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isAutoChanting, setIsAutoChanting] = useState(false);
  const [chantIntervalMs, setChantIntervalMs] = useState(2500);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceChantEnabled, setVoiceChantEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMantraIndex, setSelectedMantraIndex] = useState(0);

  const autoChantTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active mantra based on current count (1-based, wrapped around 108)
  const activeMantraIndex = currentCount === 0 ? selectedMantraIndex : (currentCount - 1) % 108;
  const activeMantra = MANTRAS_108[activeMantraIndex];

  const handleChantIncrement = () => {
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);

    // Audio chime feedback
    if (soundEnabled) {
      if (nextCount % 108 === 0) {
        playTempleBell(1.5);
      } else if (nextCount % 27 === 0) {
        playTempleBell(1.2);
      } else {
        playCymbal();
      }
    }

    // Voice recitation
    if (voiceChantEnabled) {
      const currentM = MANTRAS_108[(nextCount - 1) % 108];
      devotionalVoiceReciter.speakLines([currentM.mantra], {
        lang: 'sa-IN',
        rate: 0.95
      });
    }

    // Check if 108 milestone reached
    if (nextCount > 0 && nextCount % 108 === 0) {
      const newMalas = malasCompleted + 1;
      setMalasCompleted(newMalas);
      try {
        localStorage.setItem('japa_malas_completed', newMalas.toString());
      } catch (e) {
        console.warn(e);
      }

      // Celebratory flower confetti shower
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24']
      });
    }
  };

  const handleResetCount = () => {
    setIsAutoChanting(false);
    if (autoChantTimerRef.current) {
      clearInterval(autoChantTimerRef.current);
      autoChantTimerRef.current = null;
    }
    setCurrentCount(0);
  };

  // Auto-chanting loop effect
  useEffect(() => {
    if (isAutoChanting) {
      autoChantTimerRef.current = setInterval(() => {
        handleChantIncrement();
      }, chantIntervalMs);
    } else {
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
        autoChantTimerRef.current = null;
      }
    }

    return () => {
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
      }
    };
  }, [isAutoChanting, chantIntervalMs, currentCount, soundEnabled, voiceChantEnabled]);

  const filteredMantras = MANTRAS_108.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.mantra.toLowerCase().includes(q) ||
      m.transliteration.toLowerCase().includes(q) ||
      m.meaning.toLowerCase().includes(q) ||
      m.divineAttribute.toLowerCase().includes(q)
    );
  });

  // Calculate bead positions for a sacred circular Rudraksha / Sphatika Mala representation
  const beadCountDisplay = 108;
  const currentBeadNumber = currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108;

  return (
    <section id="mantra-108-section" className="w-full max-w-6xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>१०८ अष्टोत्तर शतनामावली व जप माळ</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif-sacred text-stone-900 tracking-tight">
          Lord Ganesha 108 Sacred Names & Japa Mala
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Chant the holy 108 divine names of Ganpati Bappa with an interactive digital Japa Mala,
          authentic chime feedback, auto-chant mode, and deep spiritual meanings.
        </p>
      </div>

      {/* Main Japa Counter Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Left Column: Interactive Japa Bead / Counter */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          {/* Circular Japa Mala Dial */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* SVG Circular Progress Ring representing 108 beads */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-amber-100"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-amber-500 transition-all duration-300"
                strokeWidth="5"
                strokeDasharray={276.4}
                strokeDashoffset={276.4 - (276.4 * currentBeadNumber) / 108}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Tap Button / Center Bead Hub */}
            <motion.button
              id="chant-bead-button"
              onClick={handleChantIncrement}
              whileTap={{ scale: 0.94 }}
              className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 text-white shadow-2xl flex flex-col items-center justify-center border-4 border-amber-200/90 group focus:outline-none cursor-pointer"
              title="Click or Tap to Chant!"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
                Bead {currentBeadNumber} / 108
              </div>
              <div className="text-4xl sm:text-5xl font-black font-serif-sacred my-1 drop-shadow-md">
                {currentCount}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-100 bg-black/20 px-3 py-0.5 rounded-full backdrop-blur">
                <span>TAP TO CHANT</span>
                <span>📿</span>
              </div>
            </motion.button>
          </div>

          {/* Quick Stats: Malas Completed & Progress */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 rounded-full border border-amber-200 text-amber-900">
              <Award className="w-4 h-4 text-amber-600" />
              <span>
                Malas Done: <strong className="text-amber-700 font-bold">{malasCompleted}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 rounded-full border border-orange-200 text-orange-900">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{Math.round((currentBeadNumber / 108) * 100)}% of current Mala</span>
            </div>
          </div>

          {/* Counter Controls (Auto-chant, Reset, Sound toggle) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Auto Chant Play/Pause */}
            <button
              id="auto-chant-btn"
              onClick={() => setIsAutoChanting(!isAutoChanting)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                isAutoChanting
                  ? 'bg-orange-600 text-white border-orange-700 animate-pulse'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              }`}
            >
              {isAutoChanting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoChanting ? 'Pause Auto-Chant' : 'Auto-Chant Mode'}</span>
            </button>

            {/* Sound Chime Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                soundEnabled
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
              title="Toggle Bell Chime Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Voice Recitation Toggle */}
            <button
              onClick={() => setVoiceChantEnabled(!voiceChantEnabled)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                voiceChantEnabled
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
              title="Voice Chanting of Mantra"
            >
              Voice: {voiceChantEnabled ? 'ON' : 'OFF'}
            </button>

            {/* Reset Counter */}
            <button
              onClick={handleResetCount}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
              title="Reset counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Mantra Card & Meaning */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-3xl border-2 border-amber-300/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-3 py-0.5 rounded-full">
                Mantra #{activeMantra.number} of 108
              </span>
              <span className="text-xs font-bold text-amber-700">
                {activeMantra.divineAttribute}
              </span>
            </div>

            {/* Big Sacred Mantra Inscription */}
            <div className="space-y-2 text-center py-2">
              <div className="text-2xl sm:text-3xl font-bold font-devanagari text-amber-950 tracking-wide">
                {activeMantra.mantra}
              </div>
              <div className="text-sm sm:text-base font-semibold text-amber-800 italic">
                {activeMantra.transliteration}
              </div>
            </div>

            {/* Meaning */}
            <div className="p-4 bg-white/90 rounded-2xl border border-amber-200 text-stone-700 space-y-1">
              <div className="text-[11px] uppercase font-bold text-stone-400">
                Spiritual Meaning
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {activeMantra.meaning}
              </p>
            </div>

            <div className="text-[11px] text-stone-500 text-center italic">
              “Continuous chanting of this sacred name invokes divine wisdom and clears worldly impediments.”
            </div>
          </div>
        </div>
      </div>

      {/* ALL 108 SACRED NAMES DIRECTORY & SEARCH */}
      <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-sacred text-stone-900">
              Complete Ashtottara Shatanamavali (108 Names Directory)
            </h3>
            <p className="text-xs text-stone-500">
              Browse, search, or select any of the 108 holy names to focus your japa meditation.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, meaning, attribute..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-amber-200 bg-stone-50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Mantras Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredMantras.map((m) => {
            const isSelected = selectedMantraIndex === m.number - 1;
            return (
              <button
                key={m.number}
                onClick={() => {
                  setSelectedMantraIndex(m.number - 1);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-1 ring-amber-400'
                    : 'bg-stone-50/70 hover:bg-amber-50/60 border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded-full">
                    #{m.number}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold truncate max-w-[120px]">
                    {m.divineAttribute}
                  </span>
                </div>
                <div className="font-bold text-sm font-devanagari text-stone-900 line-clamp-1">
                  {m.mantra}
                </div>
                <div className="text-[11px] text-stone-600 line-clamp-1 italic">
                  {m.transliteration}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
