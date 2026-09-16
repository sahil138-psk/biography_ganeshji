import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Compass,
  Flame,
  Award,
  Bell,
  ChevronDown,
  Volume2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DivineDarshanExperience } from './components/DivineDarshanExperience';
import { BirthStorySection } from './components/BirthStorySection';
import { AshtavinayakSection } from './components/AshtavinayakSection';
import { MantraJapaCounter } from './components/MantraJapaCounter';
import { AartiPlayerSection } from './components/AartiPlayerSection';
import { GaneshQuizSection } from './components/GaneshQuizSection';
import { PuneriDholTashaSection } from './components/PuneriDholTashaSection';
import { GaneshBlessingCardSection } from './components/GaneshBlessingCardSection';
import { DailyBlessingModal } from './components/DailyBlessingModal';
import { Footer } from './components/Footer';
import { ActiveTab } from './types';
import { playTempleBell } from './utils/audioSynthesizer';

const HERO_IMAGE = '/images/ganpati_bappa_hero_1789574643904.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('darshan');
  const [isBlessingModalOpen, setIsBlessingModalOpen] = useState(false);

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6ee] text-stone-800 selection:bg-amber-500 selection:text-white">
      {/* Top Devotional Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBlessing={() => setIsBlessingModalOpen(true)}
      />

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-900 via-stone-900 to-amber-950 text-white">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase backdrop-blur">
                <span className="animate-pulse">✨</span>
                <span>॥ श्री गणेशाय नमः • मंगलमूर्ती मोरया ॥</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif-sacred tracking-tight leading-tight text-white drop-shadow-md">
                  Shree Ganesh <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400">
                    Biography & Darshan
                  </span>
                </h1>
                <p className="font-devanagari text-lg sm:text-xl text-amber-200 font-semibold">
                  जन्म कथा • अष्टविनायक यात्रा • १०८ नाम जप • संपूर्ण आरती
                </p>
              </div>

              <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Welcome to the sacred digital sanctuary of Lord Ganesha. Explore the detailed birth story,
                revere all 8 holy Ashtavinayak temples, chant the 108 Ashtottara names with our interactive
                Japa Mala, and experience the divine animated Darshan with live voice Aartis.
              </p>

              {/* Quick Feature Action Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTab('darshan')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Take Divine Darshan</span>
                </button>

                <button
                  onClick={() => setActiveTab('ashtavinayak')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs sm:text-sm border border-white/20 backdrop-blur active:scale-95 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore 8 Ashtavinayak</span>
                </button>

                <button
                  onClick={() => setActiveTab('mantra-108')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs sm:text-sm border border-white/20 backdrop-blur active:scale-95 transition-all"
                >
                  <span>📿 108 Mantra Japa</span>
                </button>

                <button
                  onClick={() => setActiveTab('dhol-tasha')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs sm:text-sm border border-white/20 backdrop-blur active:scale-95 transition-all"
                >
                  <span>🥁 Dhol Tasha Jam</span>
                </button>

                <button
                  onClick={() => setActiveTab('blessing-card')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs sm:text-sm border border-white/20 backdrop-blur active:scale-95 transition-all"
                >
                  <span>🪷 E-Blessing Card</span>
                </button>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md group">
                {/* Glowing halo behind image */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none" />

                <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-black">
                  <img
                    src={HERO_IMAGE}
                    alt="Majestic Lord Ganpati Bappa"
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute bottom-4 left-5 right-5 text-center sm:text-left flex items-center justify-between">
                    <div>
                      <div className="text-amber-300 font-devanagari text-sm font-bold">
                        ॥ गणपती बाप्पा मोरया ॥
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Lord of Wisdom, Prosperity & Beginnings
                      </div>
                    </div>
                    <button
                      onClick={() => playTempleBell(1.2)}
                      className="p-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400 text-amber-950 shadow-md backdrop-blur transition-all active:scale-90"
                      title="Ring Bell"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK TAB SWITCHER TASKBAR */}
      <div className="bg-white/95 backdrop-blur-md border-b border-amber-200/90 shadow-sm sticky top-16 sm:top-20 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-2.5">
            {/* Scroll Container */}
            <div
              id="sacred-tab-bar"
              className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1"
            >
              <button
                onClick={() => setActiveTab('darshan')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'darshan'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>1. Animated Darshan</span>
              </button>

              <button
                onClick={() => setActiveTab('birth-story')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'birth-story'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>2. Birth Story & Symbolism</span>
              </button>

              <button
                onClick={() => setActiveTab('ashtavinayak')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'ashtavinayak'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>3. All 8 Ashtavinayak</span>
              </button>

              <button
                onClick={() => setActiveTab('mantra-108')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'mantra-108'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <span className="text-base">📿</span>
                <span>4. 108 Mantra Japa</span>
              </button>

              <button
                onClick={() => setActiveTab('aartis')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'aartis'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>5. Total Aartis & Voice</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <Award className="w-4 h-4 text-yellow-500" />
                <span>6. Quiz & Certificate</span>
              </button>

              <button
                onClick={() => setActiveTab('dhol-tasha')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'dhol-tasha'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <span className="text-base">🥁</span>
                <span>7. Dhol Tasha Jam</span>
              </button>

              <button
                onClick={() => setActiveTab('blessing-card')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === 'blessing-card'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30 font-extrabold'
                    : 'bg-amber-50/90 text-stone-700 hover:bg-amber-100 hover:text-stone-900 border border-amber-200'
                }`}
              >
                <span className="text-base">🪷</span>
                <span>8. E-Blessing Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {activeTab === 'darshan' && (
            <motion.div
              key="darshan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DivineDarshanExperience />
            </motion.div>
          )}

          {activeTab === 'birth-story' && (
            <motion.div
              key="birth-story"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BirthStorySection />
            </motion.div>
          )}

          {activeTab === 'ashtavinayak' && (
            <motion.div
              key="ashtavinayak"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AshtavinayakSection />
            </motion.div>
          )}

          {activeTab === 'mantra-108' && (
            <motion.div
              key="mantra-108"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <MantraJapaCounter />
            </motion.div>
          )}

          {activeTab === 'aartis' && (
            <motion.div
              key="aartis"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AartiPlayerSection />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GaneshQuizSection />
            </motion.div>
          )}

          {activeTab === 'dhol-tasha' && (
            <motion.div
              key="dhol-tasha"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PuneriDholTashaSection />
            </motion.div>
          )}

          {activeTab === 'blessing-card' && (
            <motion.div
              key="blessing-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GaneshBlessingCardSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Daily Modak of Wisdom Blessing Modal */}
      <DailyBlessingModal
        isOpen={isBlessingModalOpen}
        onClose={() => setIsBlessingModalOpen(false)}
      />

      {/* Footer with Shanti Mantra */}
      <Footer />
    </div>
  );
}
