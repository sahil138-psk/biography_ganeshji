import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Flame,
  Radio
} from 'lucide-react';
import {
  playDholBass,
  playDholTreble,
  playTasha,
  playTol,
  playLejim,
  playShankh,
  dholTashaEngine
} from '../utils/audioSynthesizer';

interface InstrumentHitState {
  dholBass: boolean;
  dholTreble: boolean;
  tasha: boolean;
  tashaRoll: boolean;
  tol: boolean;
  lejim: boolean;
  shankh: boolean;
}

export const PuneriDholTashaSection: React.FC = () => {
  const [isPlayingLoop, setIsPlayingLoop] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<'miravnuk' | 'morya' | 'kallol'>('miravnuk');
  const [bpm, setBpm] = useState(128);
  const [activeStep, setActiveStep] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [hitStates, setHitStates] = useState<InstrumentHitState>({
    dholBass: false,
    dholTreble: false,
    tasha: false,
    tashaRoll: false,
    tol: false,
    lejim: false,
    shankh: false,
  });

  // Attach beat callback from audio engine
  useEffect(() => {
    dholTashaEngine.setOnBeat((step, triggered) => {
      setActiveStep(step);
      if (triggered.includes('dhol-bass')) triggerFlash('dholBass');
      if (triggered.includes('dhol-treble')) triggerFlash('dholTreble');
      if (triggered.includes('tasha')) triggerFlash('tasha');
      if (triggered.includes('tol')) triggerFlash('tol');
    });

    return () => {
      dholTashaEngine.stop();
      dholTashaEngine.setOnBeat(() => {});
    };
  }, []);

  // Keyboard shortcut listener for live jamming!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'd':
        case 'z':
          triggerInstrument('dholBass');
          break;
        case 'f':
        case 'x':
          triggerInstrument('dholTreble');
          break;
        case 'j':
        case 'c':
          triggerInstrument('tasha');
          break;
        case 'k':
        case 'v':
          triggerInstrument('tashaRoll');
          break;
        case 't':
        case 'b':
          triggerInstrument('tol');
          break;
        case 'l':
        case 'n':
          triggerInstrument('lejim');
          break;
        case 's':
          triggerInstrument('shankh');
          break;
        case ' ':
          e.preventDefault();
          toggleLoop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayingLoop, selectedPattern, bpm]);

  const triggerFlash = (key: keyof InstrumentHitState) => {
    setHitStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setHitStates((prev) => ({ ...prev, [key]: false }));
    }, 120);
  };

  const triggerInstrument = (key: keyof InstrumentHitState) => {
    setTotalHits((prev) => prev + 1);
    triggerFlash(key);

    switch (key) {
      case 'dholBass':
        playDholBass(1.0);
        break;
      case 'dholTreble':
        playDholTreble(1.0);
        break;
      case 'tasha':
        playTasha('single', 1.0);
        break;
      case 'tashaRoll':
        playTasha('roll', 1.0);
        break;
      case 'tol':
        playTol(1.0);
        break;
      case 'lejim':
        playLejim(1.0);
        break;
      case 'shankh':
        playShankh();
        break;
    }

    // Occasional celebration confetti on milestone beats!
    if ((totalHits + 1) % 50 === 0) {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#eab308', '#dc2626'],
      });
    }
  };

  const toggleLoop = () => {
    if (isPlayingLoop) {
      dholTashaEngine.stop();
      setIsPlayingLoop(false);
    } else {
      dholTashaEngine.start(selectedPattern, bpm);
      setIsPlayingLoop(true);
    }
  };

  const handlePatternChange = (pattern: 'miravnuk' | 'morya' | 'kallol') => {
    setSelectedPattern(pattern);
    if (isPlayingLoop) {
      dholTashaEngine.start(pattern, bpm);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    dholTashaEngine.setBpm(newBpm);
  };

  return (
    <div className="space-y-8">
      {/* HEADER WITH CULTURAL CONTEXT */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-400/50">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider text-amber-100 border border-white/30">
              <Flame className="w-3.5 h-3.5 text-yellow-300" />
              <span>पुणेरी ढोल ताशा पथक • Live Festival Rhythm Studio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif-sacred text-white tracking-tight">
              Puneri Dhol Tasha Jam Pad
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm max-w-2xl font-devanagari leading-relaxed">
              महाराष्ट्राच्या गणेशोत्सवाचा चैतन्यमय नाद! खालील ढोल, ताशा, टोल आणि लेझीम वाजवा किंवा थेट मिरवणूक ताल सुरू करा.
              (Play with mouse, touch, or use keyboard keys <span className="font-mono bg-white/25 px-1 rounded">D</span>, <span className="font-mono bg-white/25 px-1 rounded">F</span>, <span className="font-mono bg-white/25 px-1 rounded">J</span>, <span className="font-mono bg-white/25 px-1 rounded">K</span>, <span className="font-mono bg-white/25 px-1 rounded">T</span>, <span className="font-mono bg-white/25 px-1 rounded">L</span>, <span className="font-mono bg-white/25 px-1 rounded">S</span>!)
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Total Beats</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-yellow-200">{totalHits}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Status</div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RHYTHM CONTROLLER & THEKA PRESETS BAR */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-amber-200 dark:border-amber-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Play/Stop Master Button */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button
            id="toggle-dhol-loop-btn"
            onClick={toggleLoop}
            className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all active:scale-95 w-full sm:w-auto ${
              isPlayingLoop
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white'
            }`}
          >
            {isPlayingLoop ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Stop Rhythm (मिरवणूक थांबवा)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Play Festival Theka (मिरवणूक गजर)</span>
              </>
            )}
          </button>

          {/* Spacebar hint */}
          <span className="hidden sm:inline-block text-[11px] text-stone-600 font-mono">
            Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded border border-stone-300 text-stone-700 font-bold">Space</kbd> to toggle
          </span>
        </div>

        {/* Pattern Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-700 mr-1 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            Select Theka:
          </span>

          <button
            onClick={() => handlePatternChange('miravnuk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPattern === 'miravnuk'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            🥁 १. पुणेरी मिरवणूक ताल (Fast)
          </button>

          <button
            onClick={() => handlePatternChange('morya')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPattern === 'morya'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            🥁 २. बाप्पा मोरया ३-ताल
          </button>

          <button
            onClick={() => handlePatternChange('kallol')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPattern === 'kallol'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            🔥 ३. कल्लोळ ठेका (Climax)
          </button>
        </div>

        {/* BPM Tempo Slider */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <Sliders className="w-4 h-4 text-amber-600" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
              <span>Speed (गती):</span>
              <span className="font-mono text-amber-700 font-bold">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="80"
              max="160"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              className="w-32 sm:w-40 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>
      </div>

      {/* ACTIVE STEP SEQUENCER VISUALIZER */}
      {isPlayingLoop && (
        <div className="bg-amber-950 p-4 rounded-2xl border border-amber-400/40 shadow-inner flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto">
          {Array.from({ length: selectedPattern === 'miravnuk' ? 16 : 8 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: activeStep === i ? 1.35 : 1,
                backgroundColor: activeStep === i ? '#facc15' : i % 4 === 0 ? '#b45309' : '#451a03',
              }}
              className={`h-6 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-black font-mono transition-colors ${
                selectedPattern === 'miravnuk' ? 'w-5 sm:w-8' : 'w-8 sm:w-12'
              } ${activeStep === i ? 'text-black shadow-lg shadow-yellow-400/50' : 'text-amber-300'}`}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      )}

      {/* THE SACRED INSTRUMENTS INTERACTIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* 1. BHAARI DHOL (DHUM BASS) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('dholBass')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.dholBass
              ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-red-600 text-white border-amber-300 shadow-2xl shadow-orange-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          {/* Top Key Badge */}
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Left Membrane (Bass)
            </span>
            <kbd className="px-2 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-xs font-black shadow">
              D / Z
            </kbd>
          </div>

          {/* Dhol SVG Visual */}
          <div className="relative my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-lg">
              <ellipse cx="50" cy="50" rx="42" ry="42" fill="#78350f" stroke="#b45309" strokeWidth="4" />
              <ellipse cx="50" cy="50" rx="34" ry="34" fill="#451a03" />
              {/* Leather tension ropes */}
              <circle cx="50" cy="50" r="28" stroke="#ca8a04" strokeWidth="2" strokeDasharray="6 3" fill="none" />
              {/* Drum center strike patch */}
              <circle cx="50" cy="50" r="14" fill="#1c1917" stroke="#b45309" strokeWidth="2" />
              {hitStates.dholBass && (
                <circle cx="50" cy="50" r="32" stroke="#facc15" strokeWidth="4" fill="none" opacity="0.8" />
              )}
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              महाकाय ढोल (धूम्)
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Deep Resonant Bass Drum Strike
            </div>
          </div>
        </motion.div>

        {/* 2. NAAD DHOL (TA TREBLE) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('dholTreble')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.dholTreble
              ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-yellow-500 text-white border-yellow-200 shadow-2xl shadow-yellow-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Right Membrane (Snappy)
            </span>
            <kbd className="px-2 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-xs font-black shadow">
              F / X
            </kbd>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-lg">
              <ellipse cx="50" cy="50" rx="42" ry="42" fill="#9a3412" stroke="#ea580c" strokeWidth="4" />
              <ellipse cx="50" cy="50" rx="34" ry="34" fill="#fef3c7" />
              <circle cx="50" cy="50" r="24" stroke="#c2410c" strokeWidth="2" fill="none" />
              {/* Stick impact mark */}
              <circle cx="50" cy="50" r="8" fill="#78350f" />
              {hitStates.dholTreble && (
                <circle cx="50" cy="50" r="30" stroke="#f59e0b" strokeWidth="4" fill="none" opacity="0.8" />
              )}
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              नाद ढोल (टा)
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Snappy Stick Strike on Treble Skin
            </div>
          </div>
        </motion.div>

        {/* 3. KADAK TASHA (SINGLE CRACK) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('tasha')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.tasha
              ? 'bg-gradient-to-b from-yellow-400 via-amber-500 to-orange-600 text-white border-yellow-200 shadow-2xl shadow-yellow-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Brass Tasha (Snap)
            </span>
            <kbd className="px-2 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-xs font-black shadow">
              J / C
            </kbd>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-lg">
              {/* Metallic brass bowl */}
              <ellipse cx="50" cy="50" rx="44" ry="32" fill="#ca8a04" stroke="#eab308" strokeWidth="4" />
              <ellipse cx="50" cy="48" rx="38" ry="26" fill="#fef08a" />
              <ellipse cx="50" cy="48" rx="28" ry="18" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
              {hitStates.tasha && (
                <ellipse cx="50" cy="48" rx="34" ry="22" stroke="#dc2626" strokeWidth="3" fill="none" />
              )}
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              कडक ताशा (एकच ठोका)
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Sharp Metallic Brass Drum Snap
            </div>
          </div>
        </motion.div>

        {/* 4. TASHA ROLL (TRIPLE THRILL) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('tashaRoll')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.tashaRoll
              ? 'bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 text-white border-yellow-200 shadow-2xl shadow-red-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Rapid Tasha Roll
            </span>
            <kbd className="px-2 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-xs font-black shadow">
              K / V
            </kbd>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-lg">
              <ellipse cx="50" cy="50" rx="44" ry="32" fill="#b45309" stroke="#f59e0b" strokeWidth="4" />
              <ellipse cx="50" cy="48" rx="38" ry="26" fill="#fef08a" />
              {/* Dual thin cane sticks crossed */}
              <line x1="25" y1="20" x2="65" y2="70" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <line x1="75" y1="20" x2="35" y2="70" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              ताशा रोल (तिरकिट गजर)
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Rapid-Fire Triple Stick Rolling Wave
            </div>
          </div>
        </motion.div>

        {/* 5. TOL (BRONZE GONG) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('tol')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.tol
              ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 text-stone-950 border-white shadow-2xl shadow-yellow-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Temple Gong & Zanj
            </span>
            <kbd className="px-2 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-xs font-black shadow">
              T / B
            </kbd>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-lg">
              {/* Heavy bronze bell/gong */}
              <circle cx="50" cy="50" r="40" fill="#eab308" stroke="#ca8a04" strokeWidth="4" />
              <circle cx="50" cy="50" r="30" fill="#facc15" stroke="#a16207" strokeWidth="2" />
              <circle cx="50" cy="50" r="14" fill="#ca8a04" />
              {hitStates.tol && (
                <circle cx="50" cy="50" r="36" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.9" />
              )}
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              झांज व टोल (घंटानाद)
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Resonant Bronze Shimmering Gong Strike
            </div>
          </div>
        </motion.div>

        {/* 6. LEJIM & SHANKH */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerInstrument('lejim')}
          className={`cursor-pointer select-none rounded-3xl p-6 border-2 transition-all shadow-md relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] ${
            hitStates.lejim
              ? 'bg-gradient-to-b from-orange-400 via-amber-500 to-red-500 text-white border-yellow-200 shadow-2xl shadow-orange-500/50 scale-[1.03]'
              : 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 text-stone-800 dark:text-stone-100 border-amber-300/80 hover:border-amber-500'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-white/10 text-amber-900 dark:text-amber-200">
              Folk Lejim & Conch
            </span>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-black/80 text-yellow-300 font-mono text-[10px] font-black shadow">
                L: Lejim
              </kbd>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInstrument('shankh');
                }}
                className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-mono text-[10px] font-black shadow active:scale-95"
                title="Blow Sacred Shankh"
              >
                S: Shankh 🐚
              </button>
            </div>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <div className="text-5xl animate-bounce">
              {hitStates.shankh ? '🐚' : '🪇'}
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl font-black font-devanagari tracking-wide text-amber-950 dark:text-amber-100">
              महाराष्ट्रीयन लेझीम व शंख
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Traditional Jingling Chimes & Holy Conch
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUICK INSTRUCTION GUIDE FOR COMPETITION JUDGES & DEVOTEES */}
      <div className="bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 text-stone-700 dark:text-stone-300 text-xs sm:text-sm">
        <h4 className="font-bold text-amber-950 dark:text-amber-200 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Cultural Significance of Puneri Dhol Tasha (ढोल-ताशाची संस्कृती व वैशिष्ट्य):
        </h4>
        <p className="leading-relaxed font-normal">
          Puneri Dhol Tasha Pathaks represent the pinnacle of unity, discipline, and devotional energy in Maharashtra’s Ganeshotsav.
          Originating from the historic streets of Pune, youth pathaks perform thunderous synchronized beats using authentic leather drums (Dhol),
          brass-shelled Tashas with cane sticks, and bronze Tols during grand Agaman and Visarjan processions. This synthesizer uses real-time Web Audio API harmonic modelling to bring this sacred festival heartbeat to life directly in your browser.
        </p>
      </div>
    </div>
  );
};
