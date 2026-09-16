import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Quote,
  Shield,
  Ear,
  Brain,
  MessageSquare,
  Globe,
  Compass,
  Cookie,
  Activity
} from 'lucide-react';
import { BIRTH_STORY_CHAPTERS, GANESHA_SYMBOLS } from '../data/birthStoryData';
import { devotionalVoiceReciter } from '../utils/audioSynthesizer';

const BIRTH_STORY_IMAGE = '/images/ganesha_birth_kailash_1789574689948.jpg';

const ICON_MAP: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5 text-amber-600" />,
  Ear: <Ear className="w-5 h-5 text-amber-600" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-amber-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-600" />,
  Cookie: <Cookie className="w-5 h-5 text-amber-600" />,
  Activity: <Activity className="w-5 h-5 text-amber-600" />,
  Compass: <Compass className="w-5 h-5 text-amber-600" />,
  Globe: <Globe className="w-5 h-5 text-amber-600" />,
  Shield: <Shield className="w-5 h-5 text-amber-600" />,
};

export const BirthStorySection: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(GANESHA_SYMBOLS[0].id);

  const currentChapter = BIRTH_STORY_CHAPTERS[activeChapterIndex];

  const handleToggleNarration = () => {
    if (isNarrating) {
      devotionalVoiceReciter.stop();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const linesToNarrate = [
        currentChapter.title,
        ...currentChapter.content,
        currentChapter.spiritualMeaning
      ];
      devotionalVoiceReciter.speakLines(linesToNarrate, {
        lang: 'en-IN',
        rate: 0.9,
        onEnd: () => setIsNarrating(false)
      });
    }
  };

  const handleNextChapter = () => {
    if (isNarrating) {
      devotionalVoiceReciter.stop();
      setIsNarrating(false);
    }
    setActiveChapterIndex((prev) => (prev + 1) % BIRTH_STORY_CHAPTERS.length);
  };

  const handlePrevChapter = () => {
    if (isNarrating) {
      devotionalVoiceReciter.stop();
      setIsNarrating(false);
    }
    setActiveChapterIndex((prev) => (prev - 1 + BIRTH_STORY_CHAPTERS.length) % BIRTH_STORY_CHAPTERS.length);
  };

  return (
    <section id="birth-story-section" className="w-full max-w-6xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide uppercase">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>पवित्र जन्म कथा व आध्यात्मिक रहस्य</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif-sacred text-stone-900 tracking-tight">
          The Sacred Birth Story of Lord Ganesha
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          From the celestial snows of Mount Kailash to the supreme blessing of Pratham Pujya:
          explore the profound journey and symbolic revelations behind the birth of Bappa.
        </p>
      </div>

      {/* Main Narrative Card with Chapter Flow */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden">
        {/* Chapter Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-amber-100 bg-amber-50/50">
          {BIRTH_STORY_CHAPTERS.map((chap, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={chap.id}
                onClick={() => {
                  if (isNarrating) {
                    devotionalVoiceReciter.stop();
                    setIsNarrating(false);
                  }
                  setActiveChapterIndex(idx);
                }}
                className={`p-4 text-left transition-all relative border-b-2 sm:border-b-0 sm:border-r border-amber-100 last:border-r-0 ${
                  isActive
                    ? 'bg-white text-amber-900 shadow-sm border-b-2 border-b-amber-600'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-amber-100/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-amber-600 text-white' : 'bg-amber-200/60 text-stone-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                    Chapter {idx + 1}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm line-clamp-1">
                  {chap.title}
                </div>
                <div className="text-[11px] text-amber-800/80 font-devanagari line-clamp-1">
                  {chap.marathiTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Chapter Content & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 lg:p-10 gap-8 items-center">
          {/* Visual Artwork Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg group">
              <img
                src={BIRTH_STORY_IMAGE}
                alt="Goddess Parvati and Bal Ganesha at Kailash"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="text-xs text-amber-200 font-semibold font-devanagari">
                  {currentChapter.marathiTitle}
                </div>
                <div className="text-white text-sm font-bold">
                  {currentChapter.title}
                </div>
              </div>
            </div>

            {/* Sacred Quote Card */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start gap-3">
              <Quote className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-950 italic">
                  {currentChapter.sacredQuote}
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  Ancient Shastra Inscription
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
                  Part {currentChapter.chapterNumber} of 4
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-sacred text-stone-900">
                  {currentChapter.title}
                </h3>
              </div>

              {/* Audio Narration Toggle */}
              <button
                onClick={handleToggleNarration}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-sm ${
                  isNarrating
                    ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
                    : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300'
                }`}
                title="Listen to story audio narration"
              >
                {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isNarrating ? 'Stop Voice' : 'Listen Voice'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-medium text-amber-900/90 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
              {currentChapter.summary}
            </p>

            {/* Paragraphs */}
            <div className="space-y-3 text-stone-700 text-sm sm:text-base leading-relaxed">
              {currentChapter.content.map((p, pIdx) => (
                <p key={pIdx} className="text-justify">
                  {p}
                </p>
              ))}
            </div>

            {/* Spiritual Meaning Highlight */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent rounded-2xl border-l-4 border-amber-500">
              <div className="text-xs uppercase font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Spiritual Significance (गूढ आध्यात्मिक अर्थ)</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-normal">
                {currentChapter.spiritualMeaning}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-100">
              <button
                onClick={handlePrevChapter}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-amber-100/60 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Stage</span>
              </button>
              <div className="text-xs font-bold text-stone-400">
                {activeChapterIndex + 1} / {BIRTH_STORY_CHAPTERS.length}
              </div>
              <button
                onClick={handleNextChapter}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SACRED GANESHA SYMBOLISM & ICONOGRAPHY MATRIX */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-sacred text-stone-900">
            Sacred Anatomy & Iconography of Bappa
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
            Every attribute of Lord Ganesha is a profound yogic instruction manual for living a wise, fearless, and spiritually enlightened life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {GANESHA_SYMBOLS.map((sym) => {
            const isCurrent = selectedSymbol === sym.id;
            return (
              <motion.div
                key={sym.id}
                onClick={() => setSelectedSymbol(sym.id)}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-br from-amber-50 to-orange-100/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-amber-100 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-200">
                    {ICON_MAP[sym.iconType] || <Sparkles className="w-5 h-5 text-amber-600" />}
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded-full font-devanagari">
                    {sym.sanskritName}
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-stone-900 mb-1">
                  {sym.name}
                </h4>
                <div className="text-xs font-semibold text-amber-700 mb-2">
                  {sym.representation}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {sym.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
