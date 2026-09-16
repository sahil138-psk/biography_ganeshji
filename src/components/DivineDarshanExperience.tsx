import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Bell,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Heart,
  Moon,
  Sun
} from 'lucide-react';
import {
  playTempleBell,
  playShankh,
  playCymbal,
  startTanpuraDrone,
  stopTanpuraDrone,
  dholTashaEngine
} from '../utils/audioSynthesizer';
import { HumanizedBhakt } from './HumanizedBhakt';

// Generated imagery
const GANESHA_IMAGE = '/src/assets/images/ganesha_divine_darshan_1789574669423.jpg';

export const DivineDarshanExperience: React.FC = () => {
  const [darshanStage, setDarshanStage] = useState<'entering' | 'pranam' | 'blessing' | 'complete'>('entering');
  const [isNightMode, setIsNightMode] = useState(false);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Sliding Bhakt & Flower Rain State
  const [slideProgress, setSlideProgress] = useState(0); // 0 to 100
  const [hasReachedBappa, setHasReachedBappa] = useState(false);
  const [isPopperBlasting, setIsPopperBlasting] = useState(false);
  const [showBlessingBanner, setShowBlessingBanner] = useState(false);
  const [isDholActive, setIsDholActive] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [maxSlideDistance, setMaxSlideDistance] = useState(380);

  const toggleDholProcession = () => {
    if (isDholActive) {
      dholTashaEngine.stop();
      setIsDholActive(false);
    } else {
      dholTashaEngine.start('miravnuk', 126);
      setIsDholActive(true);
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#eab308', '#dc2626'],
      });
    }
  };

  useEffect(() => {
    return () => {
      dholTashaEngine.stop();
    };
  }, []);

  // Offering stats
  const [modaksOffered, setModaksOffered] = useState(3);
  const [flowersOffered, setFlowersOffered] = useState(11);
  const [durvaOffered, setDurvaOffered] = useState(21);
  const [diyasLit, setDiyasLit] = useState(5);

  // Floating offering animation trigger
  const [activeOffering, setActiveOffering] = useState<string | null>(null);

  // Calculate distance between Devotee and Bappa's Lotus Throne based on stage width
  useEffect(() => {
    const updateDistance = () => {
      if (stageRef.current) {
        const width = stageRef.current.offsetWidth;
        const dist = Math.max(160, Math.min(width - 270, 560));
        setMaxSlideDistance(dist);
      }
    };
    updateDistance();
    window.addEventListener('resize', updateDistance);
    return () => window.removeEventListener('resize', updateDistance);
  }, []);

  // Sequence the initial entry animation
  const startDarshanSequence = () => {
    setDarshanStage('entering');

    setTimeout(() => {
      setDarshanStage('pranam');
    }, 2000);
  };

  useEffect(() => {
    startDarshanSequence();
  }, []);

  // Flower Rain & Popper Blast celebration when Bhakt reaches Bappa
  const triggerFlowerRainBlessing = () => {
    if (isPopperBlasting) return;
    setIsPopperBlasting(true);
    setHasReachedBappa(true);
    setSlideProgress(100);
    setDarshanStage('complete');
    setShowBlessingBanner(true);

    // 1. Auspicious Popper Blast from Bappa's lotus feet
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { x: 0.28, y: 0.58 },
      colors: ['#f59e0b', '#ef4444', '#f97316', '#fbbf24', '#ec4899', '#ffffff'],
      scalar: 1.2
    });

    // 2. Cascade of sacred marigold & rose petals raining from above
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 80,
        origin: { x: 0.2, y: 0.15 },
        colors: ['#f59e0b', '#fbbf24', '#e11d48', '#f43f5e'],
        ticks: 240,
        gravity: 0.7
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 80,
        origin: { x: 0.45, y: 0.15 },
        colors: ['#f59e0b', '#fbbf24', '#e11d48', '#f43f5e'],
        ticks: 240,
        gravity: 0.7
      });
    }, 250);

    // 3. Side joyous celebration popper blast
    setTimeout(() => {
      confetti({
        particleCount: 65,
        spread: 120,
        origin: { x: 0.35, y: 0.45 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#ffffff']
      });
    }, 550);

    // Auspicious temple chime
    playTempleBell(0.9);

    setTimeout(() => {
      setIsPopperBlasting(false);
    }, 2000);
  };

  const handleResetSlide = () => {
    setSlideProgress(0);
    setHasReachedBappa(false);
    setShowBlessingBanner(false);
    setDarshanStage('pranam');
  };

  const handleSlideChange = (newVal: number) => {
    setSlideProgress(newVal);
    if (newVal >= 88 && !hasReachedBappa) {
      triggerFlowerRainBlessing();
    } else if (newVal < 75 && hasReachedBappa) {
      setHasReachedBappa(false);
      setShowBlessingBanner(false);
    }
  };

  const toggleAmbient = () => {
    if (isAmbientPlaying) {
      stopTanpuraDrone();
      setIsAmbientPlaying(false);
    } else {
      startTanpuraDrone();
      setIsAmbientPlaying(true);
    }
  };

  const handleRingBell = () => {
    setIsBellRinging(true);
    playTempleBell(1.0);
    setTimeout(() => setIsBellRinging(false), 900);
  };

  const handleBlowShankh = () => {
    playShankh();
  };

  const handleOfferModak = () => {
    setModaksOffered(prev => prev + 1);
    setActiveOffering('modak');
    setTimeout(() => setActiveOffering(null), 1200);
  };

  const handleOfferFlower = () => {
    setFlowersOffered(prev => prev + 1);
    setActiveOffering('flower');
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: 0.4, y: 0.6 },
      colors: ['#ef4444', '#dc2626', '#f87171']
    });
    setTimeout(() => setActiveOffering(null), 1200);
  };

  const handleOfferDurva = () => {
    setDurvaOffered(prev => prev + 21);
    setActiveOffering('durva');
    setTimeout(() => setActiveOffering(null), 1200);
  };

  const aartiAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isSingingAartiPlaying, setIsSingingAartiPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (aartiAudioRef.current) {
        aartiAudioRef.current.pause();
      }
    };
  }, []);

  const handleWaveAarti = () => {
    setDiyasLit(prev => prev + 1);

    if (aartiAudioRef.current) {
      if (isSingingAartiPlaying) {
        aartiAudioRef.current.pause();
        setIsSingingAartiPlaying(false);
        setIsAartiActive(false);
      } else {
        setIsAartiActive(true);
        aartiAudioRef.current.play()
          .then(() => setIsSingingAartiPlaying(true))
          .catch((err) => {
            console.warn(err);
            setIsAartiActive(true);
            setTimeout(() => setIsAartiActive(false), 5000);
          });
      }
    } else {
      setIsAartiActive(true);
      setTimeout(() => setIsAartiActive(false), 5000);
    }
  };

  return (
    <section id="darshan-experience" className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-300/40">
      {/* Native Singing Aarti Audio */}
      <audio
        ref={aartiAudioRef}
        src="/audio/sukhakarta_dukhaharta.mp3"
        preload="auto"
        onEnded={() => {
          setIsSingingAartiPlaying(false);
          setIsAartiActive(false);
        }}
      />
      {/* Mandir Header & Environment Controls */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors duration-500 ${
        isNightMode ? 'bg-stone-900 text-amber-200 border-b border-amber-900/60' : 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 backdrop-blur-md flex items-center justify-center border border-amber-300/50 shadow-inner">
            <span className="font-devanagari text-xl text-amber-300">ॐ</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-sacred tracking-wide">
              दिव्य दर्शन व पूजा मंडप
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
              Interactive Divine Darshan & Temple Offerings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Replay Darshan Sequence */}
          <button
            id="replay-darshan-btn"
            onClick={startDarshanSequence}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur transition-all border border-white/20 active:scale-95"
            title="Replay Darshan Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Darshan</span>
          </button>

          {/* Dhol Tasha Festive Procession Toggle */}
          <button
            id="darshan-dhol-procession-btn"
            onClick={toggleDholProcession}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur transition-all border ${
              isDholActive
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-yellow-300 shadow-lg animate-pulse'
                : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
            }`}
            title="Toggle Live Puneri Dhol Tasha Procession (मिरवणूक गजर)"
          >
            <span>🥁</span>
            <span className="hidden sm:inline">
              {isDholActive ? 'मिरवणूक सुरु 🥁' : 'ढोल ताशा गजर'}
            </span>
          </button>

          {/* Ambient Music Toggle */}
          <button
            id="ambient-sound-btn"
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur transition-all border ${
              isAmbientPlaying ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md' : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
            }`}
            title="Temple Tanpura Ambiance"
          >
            {isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Temple Tanpura</span>
          </button>

          {/* Day / Deepotsav Night Mode Toggle */}
          <button
            id="night-mode-toggle"
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-amber-200 transition-all border border-white/20"
            title={isNightMode ? 'Switch to Morning Sanctum' : 'Switch to Deepotsav Night'}
          >
            {isNightMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
          </button>
        </div>
      </div>

      {/* THE SACRED MANDIR STAGE */}
      <div
        ref={stageRef}
        className={`relative w-full h-[520px] sm:h-[580px] overflow-hidden transition-colors duration-700 select-none ${
          isNightMode
            ? 'bg-gradient-to-b from-stone-950 via-[#1a0f07] to-amber-950'
            : 'bg-gradient-to-b from-amber-100/90 via-orange-50/80 to-amber-200/90'
        }`}
      >
        {/* Background Architectural Elements: Temple Pillars, Toran & Arch */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 right-0 h-16 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/30 to-transparent" />
          {/* Left Temple Column */}
          <div className="absolute top-0 bottom-0 left-6 w-12 border-r-2 border-amber-600/40 bg-gradient-to-r from-amber-900/10 to-transparent" />
          {/* Right Temple Column */}
          <div className="absolute top-0 bottom-0 right-6 w-12 border-l-2 border-amber-600/40 bg-gradient-to-l from-amber-900/10 to-transparent" />
        </div>

        {/* Traditional Toran & Marigold Garland at Top */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between px-4 py-1 pointer-events-none">
          <div className="flex gap-3 text-amber-500 text-lg opacity-80 animate-pulse">
            <span>🏵️</span><span>🌿</span><span>🏵️</span><span>🌿</span><span>🏵️</span>
          </div>
          <div className="hidden sm:flex gap-3 text-amber-500 text-lg opacity-80 animate-pulse">
            <span>🌿</span><span>🏵️</span><span>🌿</span><span>🏵️</span><span>🌿</span>
          </div>
          <div className="flex gap-3 text-amber-500 text-lg opacity-80 animate-pulse">
            <span>🏵️</span><span>🌿</span><span>🏵️</span><span>🌿</span><span>🏵️</span>
          </div>
        </div>

        {/* Temple Bell (Interactive / Animated) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-1.5 h-16 sm:h-20 bg-gradient-to-b from-amber-700 via-amber-500 to-amber-400 shadow-md" />
          <motion.button
            id="temple-bell-trigger"
            onClick={handleRingBell}
            animate={isBellRinging ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] } : { rotate: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="group relative cursor-pointer focus:outline-none"
            title="Click to ring the holy temple bell"
          >
            <div className="w-12 h-14 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 rounded-b-2xl shadow-xl flex items-center justify-center border border-amber-200">
              <Bell className="w-7 h-7 text-amber-950 drop-shadow" />
            </div>
            <div className="w-2.5 h-4 bg-amber-700 mx-auto -mt-1 rounded-b-full shadow" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Ring Bell
            </span>
          </motion.button>
        </div>

        {/* Central Divine Sanctum Platform / Mandap */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amber-900/80 via-amber-800/40 to-transparent border-t border-amber-600/30 flex items-end justify-center pb-3">
          <div className="w-3/4 max-w-xl h-6 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 rounded-t-lg shadow-2xl border-t border-amber-400/50 flex items-center justify-around px-8">
            <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <div className="text-[11px] uppercase tracking-widest text-amber-200 font-bold">
              ॥ श्री गणेशाय नमः ॥
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          </div>
        </div>

        {/* Diyas glowing on the platform */}
        <div className="absolute bottom-7 left-12 sm:left-24 z-20 flex gap-4">
          <div className="relative">
            <div className="w-6 h-3 bg-amber-700 rounded-b-full border border-amber-500" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full animate-diya" />
          </div>
        </div>
        <div className="absolute bottom-7 right-12 sm:right-24 z-20 flex gap-4">
          <div className="relative">
            <div className="w-6 h-3 bg-amber-700 rounded-b-full border border-amber-500" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full animate-diya" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ANIMATION ACTOR 1: GANPATI BAPPA COMES FROM THE LEFT SIDE */}
        {/* ========================================================= */}
        <motion.div
          id="ganpati-bappa-actor"
          initial={{ x: -280, opacity: 0, scale: 0.9 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 45,
              damping: 14,
              duration: 2.2,
            }
          }}
          className="absolute left-4 sm:left-16 bottom-16 z-20 flex flex-col items-center"
        >
          {/* Divine Aura / Radiant Halo */}
          <div className="relative flex items-center justify-center">
            {/* Spinning Mandala Glow */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-dashed border-amber-400/40 bg-gradient-to-tr from-yellow-400/25 via-amber-500/30 to-orange-500/20 blur-sm pointer-events-none"
            />
            {/* Inner Golden Pulse */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-amber-300/30 blur-xl animate-pulse pointer-events-none" />

            {/* Bappa Murti Card / Visual */}
            <div className="relative w-44 h-56 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-amber-950/40 backdrop-blur-sm group">
              <img
                src={GANESHA_IMAGE}
                alt="Lord Ganpati Bappa Divine Darshan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-amber-500/20" />
              
              {/* Sacred Nameplate */}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-md font-devanagari">
                  श्री गणपती बाप्पा
                </span>
              </div>
            </div>
          </div>

          {/* Pedestal / Lotus Throne */}
          <div className="relative -mt-3 w-52 sm:w-64 h-8 bg-gradient-to-r from-red-800 via-amber-600 to-red-800 rounded-full border border-amber-300/80 shadow-lg flex items-center justify-center">
            <span className="text-[10px] text-amber-100 font-bold uppercase tracking-wider">
              ॥ विघ्नहर्ता मंगलमूर्ती ॥
            </span>
          </div>

          {/* Divine Blessing Glow Beam extending from Bappa to Devotee */}
          <AnimatePresence>
            {(darshanStage === 'blessing' || darshanStage === 'complete') && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute top-24 left-36 sm:left-48 w-44 sm:w-64 h-12 bg-gradient-to-r from-amber-400/80 via-yellow-200/50 to-transparent blur-md rounded-full pointer-events-none origin-left"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ============================================================== */}
        {/* SACRED FLOOR WATERMARK & SLIDE GUIDANCE PATHWAY               */}
        {/* ============================================================== */}
        <div className="absolute bottom-20 left-48 sm:left-64 right-20 sm:right-36 z-10 pointer-events-none flex flex-col items-center justify-center select-none text-center">
          {/* Sacred Golden Footprint / Lotus Path */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 text-amber-700/35 dark:text-amber-300/30 mb-1">
            <span className="text-sm sm:text-base opacity-75">🪷</span>
            <span className="text-xs tracking-widest font-mono">‹‹‹‹</span>
            <span className="text-sm sm:text-base opacity-75">👣</span>
            <span className="text-xs tracking-widest font-mono">‹‹‹‹</span>
            <span className="text-sm sm:text-base opacity-75">🪷</span>
            <span className="text-xs tracking-widest font-mono">‹‹‹‹</span>
            <span className="text-sm sm:text-base opacity-75">👣</span>
          </div>

          {/* Glowing Animated Watermark Text */}
          <motion.div
            animate={{
              opacity: hasReachedBappa ? [0.7, 1, 0.7] : [0.35, 0.75, 0.35],
              x: hasReachedBappa ? 0 : [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-0.5"
          >
            {hasReachedBappa ? (
              <div className="px-3 sm:px-5 py-1 rounded-full bg-amber-500/25 border border-amber-400/50 backdrop-blur-sm text-amber-900 dark:text-amber-100 shadow-md">
                <span className="text-xs sm:text-sm font-bold font-devanagari tracking-wide">
                  ✨ गणपती बाप्पा मोरया! चरणस्पर्श व आशीर्वाद प्राप्त! ✨
                </span>
              </div>
            ) : (
              <>
                <div className="text-[11px] sm:text-sm font-extrabold font-devanagari text-amber-900/50 dark:text-amber-200/40 tracking-wider">
                  👈 बाप्पाच्या चरणाशी जाण्यासाठी भक्त सरकवा 👈
                </div>
                <div className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-amber-800/40 dark:text-amber-300/35">
                  SLIDE BHAKT TO BAPPA FOR DIVINE DARSHAN
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* ANIMATION ACTOR 2: SLIDEABLE & DRAGGABLE DEVOTEE BHAKT        */}
        {/* ============================================================== */}
        <motion.div
          id="devotee-bhakt-actor"
          initial={{ x: 300, opacity: 0 }}
          animate={{
            x: -(slideProgress / 100) * maxSlideDistance,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 18,
          }}
          drag="x"
          dragConstraints={{ left: -maxSlideDistance, right: 0 }}
          dragElastic={0.06}
          onDrag={(_, info) => {
            const currentDist = Math.max(0, Math.min(maxSlideDistance, -info.offset.x));
            const pct = (currentDist / maxSlideDistance) * 100;
            setSlideProgress(pct);
            if (pct >= 85 && !hasReachedBappa) {
              triggerFlowerRainBlessing();
            }
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -maxSlideDistance * 0.65) {
              triggerFlowerRainBlessing();
            } else if (!hasReachedBappa) {
              setSlideProgress(0);
            }
          }}
          className="absolute right-6 sm:right-20 bottom-16 z-20 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {/* Floating guidance pill above Devotee */}
          <div className="mb-1 pointer-events-none">
            {hasReachedBappa ? (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-lg border border-emerald-300 animate-pulse">
                <span>🌺</span>
                <span>चरणी नतमस्तक (Blessed)</span>
              </span>
            ) : (
              <motion.span
                animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-950 shadow-lg border border-amber-500"
              >
                <span>👈</span>
                <span>Slide Me to Bappa!</span>
              </motion.span>
            )}
          </div>

          {/* Humanized Devotee Figure with responsive bow angle towards Bappa */}
          <motion.div
            animate={{
              y: hasReachedBappa ? 20 : (slideProgress / 100) * 14,
              rotate: hasReachedBappa ? -18 : -(slideProgress / 100) * 14,
            }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 16
            }}
            className="relative flex flex-col items-center"
          >
            <HumanizedBhakt isBlessed={hasReachedBappa} slideProgress={slideProgress} />
          </motion.div>

          {/* Devotee Name & Status Tag */}
          <div className="mt-2 text-center">
            <div className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-900/60 text-amber-200 border border-amber-500/40 backdrop-blur">
              {hasReachedBappa
                ? 'Darshan Blessed! 🌺'
                : slideProgress > 0
                ? `Approaching Bappa (${Math.round(slideProgress)}%) 🙏`
                : 'Bowing in Pranam (Slide to Bappa) 👈'}
            </div>
          </div>
        </motion.div>

        {/* Interactive Slide Control Bar across Mandir Floor */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-amber-950/85 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full border border-amber-400/60 shadow-2xl max-w-[94%]">
          <div className="flex items-center gap-1.5 text-amber-200 text-xs font-bold whitespace-nowrap">
            <span className="text-amber-400">👈</span>
            <span className="hidden sm:inline">Slide Bhakt:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="bhakt-slide-range"
              type="range"
              min="0"
              max="100"
              value={slideProgress}
              onChange={(e) => handleSlideChange(Number(e.target.value))}
              className="w-32 sm:w-56 h-2 bg-amber-900/90 rounded-lg appearance-none cursor-pointer accent-amber-400"
              title="Slide devotee to Bappa"
            />
            <span className="text-[11px] font-mono text-amber-300 font-bold min-w-[36px]">
              {Math.round(slideProgress)}%
            </span>
          </div>

          {hasReachedBappa ? (
            <button
              id="slide-again-button"
              onClick={handleResetSlide}
              className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black flex items-center gap-1 shadow transition-all active:scale-95"
              title="Reset position to slide again"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Slide Again 🔄</span>
            </button>
          ) : (
            <button
              id="reach-bappa-button"
              onClick={triggerFlowerRainBlessing}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-stone-950 text-xs font-black flex items-center gap-1 shadow transition-all active:scale-95"
              title="Directly touch Bappa's holy feet"
            >
              <Sparkles className="w-3 h-3 text-amber-900" />
              <span>Reach Bappa 🌺</span>
            </button>
          )}
        </div>

        {/* Divine Blessing Celebration Overlay */}
        <AnimatePresence>
          {showBlessingBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-5 sm:px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white shadow-2xl border-2 border-amber-300 flex items-center gap-3 backdrop-blur-md max-w-[90%]"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce flex-shrink-0">
                🌺
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-extrabold font-devanagari text-yellow-100">
                  ॥ श्री गणेशाय नमः • चरणस्पर्श व कृपावर्षाव ॥
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">
                  Divine Flower Rain & Bappa's Blessings Showered upon Bhakt! ✨
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce flex-shrink-0">
                🎉
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Aarti Diya Animation (Rotating around the center) */}
        <AnimatePresence>
          {isAartiActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 360,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed border-amber-400/60 pointer-events-none z-30 flex items-center justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 shadow-2xl flex items-center justify-center border-2 border-yellow-200 animate-diya">
                <Flame className="w-6 h-6 text-yellow-100" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Flying Offering Micro-feedback */}
        <AnimatePresence>
          {activeOffering && (
            <motion.div
              initial={{ y: 200, x: 200, opacity: 1, scale: 1.5 }}
              animate={{ y: -60, x: -120, opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute z-40 pointer-events-none text-3xl font-bold"
            >
              {activeOffering === 'modak' && '🥟'}
              {activeOffering === 'flower' && '🌺'}
              {activeOffering === 'durva' && '🌿'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INTERACTIVE DEVOTIONAL OFFERINGS TRAY */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-100/70 p-5 sm:p-6 border-t border-amber-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-950 font-serif-sacred flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>भक्ति अर्पण (Offer Devotional Items to Bappa)</span>
            </h3>
            <p className="text-xs text-stone-600">
              Click items below to offer them directly at Bappa’s feet with sound and flower showers.
            </p>
          </div>

          {/* Session Tracker Badges */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-200/70 px-3 py-1.5 rounded-full border border-amber-300">
            <span>🥟 {modaksOffered} Modaks</span>
            <span>•</span>
            <span>🌺 {flowersOffered} Flowers</span>
            <span>•</span>
            <span>🌿 {durvaOffered} Durva</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {/* 1. Offer Modak */}
          <button
            id="offer-modak-btn"
            onClick={handleOfferModak}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md transition-all active:scale-95 group"
          >
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">🥟</span>
            <span className="text-xs font-bold text-amber-900">Offer Modak</span>
            <span className="text-[10px] text-amber-600">मोदक अर्पण</span>
          </button>

          {/* 2. Offer Red Hibiscus Flower */}
          <button
            id="offer-flower-btn"
            onClick={handleOfferFlower}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-red-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all active:scale-95 group"
          >
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">🌺</span>
            <span className="text-xs font-bold text-red-900">Jaswand Flower</span>
            <span className="text-[10px] text-red-600">लाल जास्वंद</span>
          </button>

          {/* 3. Offer 21 Durva Grass */}
          <button
            id="offer-durva-btn"
            onClick={handleOfferDurva}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all active:scale-95 group"
          >
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">🌿</span>
            <span className="text-xs font-bold text-emerald-900">21 Durva Grass</span>
            <span className="text-[10px] text-emerald-600">२१ दुर्वा जुडी</span>
          </button>

          {/* 4. Perform Aarti & Sing */}
          <button
            id="wave-aarti-btn"
            onClick={handleWaveAarti}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border shadow-sm transition-all active:scale-95 group ${
              isSingingAartiPlaying
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-white border-amber-300 hover:border-amber-500 hover:shadow-md'
            }`}
            title={isSingingAartiPlaying ? 'Pause Singing Aarti' : 'Play Singing Aarti & Wave Thali'}
          >
            <Flame className={`w-7 h-7 mb-1 group-hover:scale-125 transition-transform ${
              isSingingAartiPlaying ? 'text-white animate-pulse' : 'text-amber-600'
            }`} />
            <span className="text-xs font-bold text-amber-950">
              {isSingingAartiPlaying ? 'Pause Aarti' : 'Singing Aarti'}
            </span>
            <span className="text-[10px] text-amber-700">
              {isSingingAartiPlaying ? 'सुरु आहे 🎵' : 'आरती ओवाळा व ऐका'}
            </span>
          </button>

          {/* 5. Ring Temple Bell */}
          <button
            id="ring-bell-tray-btn"
            onClick={handleRingBell}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-yellow-300 hover:border-yellow-500 shadow-sm hover:shadow-md transition-all active:scale-95 group"
          >
            <Bell className="w-7 h-7 text-yellow-600 mb-1 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold text-yellow-950">Ring Bell</span>
            <span className="text-[10px] text-yellow-700">घंटा नाद</span>
          </button>

          {/* 6. Blow Sacred Shankh */}
          <button
            id="blow-shankh-btn"
            onClick={handleBlowShankh}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all active:scale-95 group"
          >
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">🐚</span>
            <span className="text-xs font-bold text-stone-900">Blow Shankh</span>
            <span className="text-[10px] text-amber-700">शंख ध्वनी</span>
          </button>
        </div>
      </div>
    </section>
  );
};
