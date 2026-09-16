import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  Search,
  X,
  Maximize2,
  Bell
} from 'lucide-react';
import { ASHTAVINAYAK_TEMPLES } from '../data/ashtavinayakData';
import { AshtavinayakTemple } from '../types';
import { playTempleBell, playCymbal } from '../utils/audioSynthesizer';

export const AshtavinayakSection: React.FC = () => {
  const [selectedTemple, setSelectedTemple] = useState<AshtavinayakTemple | null>(null);
  const [darshanMurtiTemple, setDarshanMurtiTemple] = useState<AshtavinayakTemple | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [visitedTemples, setVisitedTemples] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ashtavinayak_visited');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleVisited = (templeId: string) => {
    setVisitedTemples((prev) => {
      const updated = prev.includes(templeId)
        ? prev.filter((id) => id !== templeId)
        : [...prev, templeId];
      try {
        localStorage.setItem('ashtavinayak_visited', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleOpenMurtiDarshan = (temple: AshtavinayakTemple) => {
    setDarshanMurtiTemple(temple);
  };

  const filteredTemples = ASHTAVINAYAK_TEMPLES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.deity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || t.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const districts = ['all', ...Array.from(new Set(ASHTAVINAYAK_TEMPLES.map((t) => t.district)))];

  return (
    <section id="ashtavinayak-section" className="w-full max-w-6xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-950 text-xs font-bold tracking-wide uppercase">
          <Compass className="w-4 h-4 text-orange-600" />
          <span>पवित्र अष्टविनायक यात्रा व इतिहास</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif-sacred text-stone-900 tracking-tight">
          The Sacred 8 Ashtavinayak Temples of Maharashtra
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Self-manifested (Swayambhu) idols revered since antiquity. Discover the holy legends,
          sacred route order, and miraculous stories of each divine shrine.
        </p>
      </div>

      {/* Pilgrimage Progress Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-3xl border border-amber-300/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs uppercase font-bold text-amber-900 tracking-wider flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Personal Yatra Progress</span>
          </div>
          <div className="text-sm font-semibold text-stone-800">
            You have marked <strong className="text-amber-700">{visitedTemples.length}</strong> of 8 holy temples visited.
          </div>
          <p className="text-xs text-stone-500">
            Traditional Yatra starts at Morgaon and concludes at Morgaon to complete the circle.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="h-3 w-full bg-amber-200/70 rounded-full overflow-hidden border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
              style={{ width: `${(visitedTemples.length / 8) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-stone-600">
            <span>Morgaon Start</span>
            <span>{Math.round((visitedTemples.length / 8) * 100)}% Complete</span>
            <span>Morgaon End</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="temple-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by temple, city, or legend..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-amber-200 bg-white text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm"
          />
        </div>

        {/* District Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {districts.map((dist) => (
            <button
              key={dist}
              onClick={() => setDistrictFilter(dist)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                districtFilter === dist
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                  : 'bg-white text-stone-600 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {dist === 'all' ? 'All Temples (8)' : `${dist} District`}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Temples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTemples.map((temple) => {
          const isVisited = visitedTemples.includes(temple.id);
          return (
            <motion.div
              key={temple.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-amber-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Image Banner */}
              <div
                onClick={() => handleOpenMurtiDarshan(temple)}
                className="relative h-48 overflow-hidden cursor-pointer group/img"
                title="Click to take full Murti Darshan"
              >
                <img
                  src={temple.image}
                  alt={temple.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-black/25 to-transparent" />

                {/* Yatra Sequence Number */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white font-bold text-xs shadow">
                  #{temple.order} Yatra Stop
                </div>

                {/* Trunk Direction Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md text-white shadow ${
                  temple.trunkDirection === 'Right' ? 'bg-red-600/90' : 'bg-stone-800/80'
                }`}>
                  {temple.trunkDirection === 'Right' ? 'Right Trunk (सिद्धटेक)' : 'Left Trunk'}
                </div>

                {/* Murti Darshan quick zoom badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>View Sacred Idol</span>
                </div>

                {/* Marathi Name on bottom */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <div className="text-amber-300 text-xs font-devanagari font-bold line-clamp-1">
                    {temple.marathiName}
                  </div>
                  <span className="text-[10px] text-amber-200/90 font-medium">
                    🔍 Darshan
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-stone-900 leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {temple.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="line-clamp-1">{temple.location}</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-3 pt-1">
                    {temple.legend}
                  </p>
                </div>

                {/* Actions: View Details & Mark Visited */}
                <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleVisited(temple.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isVisited
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isVisited ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span>{isVisited ? 'Visited' : 'Mark Visited'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedTemple(temple)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                  >
                    <span>Full Info</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TEMPLE DETAIL MODAL */}
      <AnimatePresence>
        {selectedTemple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-amber-300 flex flex-col"
            >
              {/* Modal Header Banner */}
              <div className="relative h-48 sm:h-56">
                <img
                  src={selectedTemple.image}
                  alt={selectedTemple.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <button
                  onClick={() => setSelectedTemple(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Stop #{selectedTemple.order} of Ashtavinayak Yatra • {selectedTemple.district}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-sacred">
                    {selectedTemple.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-devanagari text-amber-200">
                    {selectedTemple.marathiName}
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-stone-700 text-sm">
                {/* Deity & Trunk Spec */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700">Presiding Deity Form</span>
                    <div className="font-bold text-xs sm:text-sm text-stone-900">{selectedTemple.deity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700">Trunk Orientation</span>
                    <div className="font-bold text-xs sm:text-sm text-stone-900">
                      {selectedTemple.trunkDirection === 'Right' ? 'Right (दक्षिणमुख / उजवी सोंड)' : 'Left (डावी सोंड)'}
                    </div>
                  </div>
                </div>

                {/* Holy Legend / Purana Context */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-base text-amber-800">
                    <Info className="w-4 h-4" />
                    <span>Sacred Legend & Purana Story</span>
                  </h4>
                  <p className="text-stone-600 leading-relaxed text-justify">
                    {selectedTemple.legend}
                  </p>
                </div>

                {/* Architecture & History */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-base text-amber-800">
                    <Sparkles className="w-4 h-4" />
                    <span>Temple Architecture & Historical Heritage</span>
                  </h4>
                  <p className="text-stone-600 leading-relaxed text-justify">
                    {selectedTemple.history}
                  </p>
                </div>

                {/* Significance & Spiritual Powers */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-base text-amber-800">
                    Spiritual Significance
                  </h4>
                  <p className="text-stone-600 leading-relaxed text-justify">
                    {selectedTemple.significance}
                  </p>
                </div>

                {/* Festivals & How to reach */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-100">
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Major Festivals</span>
                    </div>
                    <p className="text-xs text-stone-600">{selectedTemple.festival}</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Pilgrim Travel Guide</span>
                    </div>
                    <p className="text-xs text-stone-600">{selectedTemple.howToReach}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex items-center justify-between">
                <button
                  onClick={() => toggleVisited(selectedTemple.id)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <CheckCircle2 className={`w-4 h-4 ${visitedTemples.includes(selectedTemple.id) ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{visitedTemples.includes(selectedTemple.id) ? 'Visited on Pilgrimage' : 'Mark as Visited'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const temp = selectedTemple;
                      setSelectedTemple(null);
                      handleOpenMurtiDarshan(temp);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Idol</span>
                  </button>
                  <button
                    onClick={() => setSelectedTemple(null)}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEDICATED FULLSCREEN MURTI DARSHAN MODAL */}
      <AnimatePresence>
        {darshanMurtiTemple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-stone-900 border-2 border-amber-400/80 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-white relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setDarshanMurtiTemple(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur transition-all border border-white/20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sanctum Glow Image */}
              <div className="relative w-full h-[60vh] max-h-[500px] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={darshanMurtiTemple.image}
                  alt={darshanMurtiTemple.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />

                {/* Floating Ring Bell Button on Darshan */}
                <button
                  onClick={() => playTempleBell(1.3)}
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all active:scale-95"
                >
                  <Bell className="w-4 h-4" />
                  <span>Ring Bell</span>
                </button>
              </div>

              {/* Darshan Inscriptions & Prayer */}
              <div className="p-6 bg-stone-950 border-t border-amber-500/40 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      ॥ पवित्र स्वयंभू मूर्ती दर्शन • Stop #{darshanMurtiTemple.order} ॥
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif-sacred font-bold text-white">
                      {darshanMurtiTemple.name}
                    </h3>
                    <p className="font-devanagari text-sm text-amber-200">
                      {darshanMurtiTemple.marathiName} ({darshanMurtiTemple.location})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Trunk: {darshanMurtiTemple.trunkDirection === 'Right' ? 'Right (उजवी)' : 'Left (डावी)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-stone-300 border-t border-stone-800 flex items-center justify-between">
                  <span className="italic text-amber-300/90">
                    “गणपती बाप्पा मोरया, मंगलमूर्ती मोरया”
                  </span>
                  <button
                    onClick={() => setDarshanMurtiTemple(null)}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
                  >
                    Back to Temples
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
