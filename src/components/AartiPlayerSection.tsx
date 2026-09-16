import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  Music,
  Radio,
  Sparkles
} from 'lucide-react';
import { AARTI_COLLECTION } from '../data/aartiData';
import { AartiItem } from '../types';
import {
  startTanpuraDrone,
  stopTanpuraDrone
} from '../utils/audioSynthesizer';

export const AartiPlayerSection: React.FC = () => {
  const [selectedAarti, setSelectedAarti] = useState<AartiItem>(AARTI_COLLECTION[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<'devanagari' | 'english' | 'meaning'>('devanagari');
  const [ambientTanpura, setAmbientTanpura] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientTanpuraRef = useRef(ambientTanpura);
  ambientTanpuraRef.current = ambientTanpura;

  // Stop playback ONLY when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ambientTanpuraRef.current) {
        stopTanpuraDrone();
      }
    };
  }, []);

  // Handle switching aarti
  const handleSelectAarti = (aarti: AartiItem) => {
    setSelectedAarti(aarti);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      const targetAudioUrl = aarti.audioUrl || '/audio/sukhakarta_dukhaharta.mp3';
      audioRef.current.src = targetAudioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      if (isPlaying) {
        setIsLoadingAudio(true);
        audioRef.current
          .play()
          .then(() => {
            setIsLoadingAudio(false);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback error on switch:', err);
            setIsPlaying(false);
            setIsLoadingAudio(false);
          });
      }
    }
  };

  // Toggle Play / Pause - direct authentic singing audio
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      const targetAudioUrl = selectedAarti.audioUrl || '/audio/sukhakarta_dukhaharta.mp3';
      if (!audioRef.current.src || !audioRef.current.src.includes(targetAudioUrl)) {
        audioRef.current.src = targetAudioUrl;
        audioRef.current.currentTime = currentTime;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch((err) => {
          console.warn('Audio play failed:', err);
          setIsLoadingAudio(false);
          setIsPlaying(false);
        });
    }
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Restart aarti
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Ambient Tanpura background drone
  const handleToggleAmbient = () => {
    if (ambientTanpura) {
      stopTanpuraDrone();
      setAmbientTanpura(false);
    } else {
      startTanpuraDrone();
      setAmbientTanpura(true);
    }
  };

  // Calculate approximate active lyric line according to percentage played
  const lineCount = selectedAarti.devanagariLyrics.length;
  const activeLineIndex = duration > 0 && isPlaying
    ? Math.min(Math.floor((currentTime / duration) * lineCount), lineCount - 1)
    : -1;

  // Jump to specific line when user clicks it
  const handleJumpToLine = (idx: number) => {
    if (duration > 0 && audioRef.current) {
      const targetTime = (idx / lineCount) * duration;
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  // Time format helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="aarti-player-section" className="w-full max-w-6xl mx-auto space-y-10">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={selectedAarti.audioUrl || '/audio/sukhakarta_dukhaharta.mp3'}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onCanPlay={() => {
          if (audioRef.current && (!duration || duration === 0)) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-950 text-xs font-bold tracking-wide uppercase">
          <Flame className="w-4 h-4 text-red-600 animate-pulse" />
          <span>संपूर्ण गणेश आरती गायन • Singing Aarti Sanctuary</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif-sacred text-stone-900 tracking-tight">
          Devotional Singing Aartis with Live Lyrics
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Press play to listen to authentic devotional singing aartis featuring traditional dhol-tasha,
          cymbals, harmonium, and melodious chorus chanting. Follow along with interactive synchronized lyrics.
        </p>
      </div>

      {/* Main Aarti Player Console */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden">
        {/* Top Bar: Aarti Selector Tabs */}
        <div className="flex items-center overflow-x-auto bg-amber-50/70 border-b border-amber-200 p-2 gap-2">
          {AARTI_COLLECTION.map((aarti) => {
            const isSelected = aarti.id === selectedAarti.id;
            return (
              <button
                key={aarti.id}
                onClick={() => handleSelectAarti(aarti)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-amber-100/60 border border-amber-200/60'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-amber-600'}`} />
                <span>{aarti.title.split('(')[0].trim()}</span>
                {isSelected && isPlaying && (
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Master Singing Aarti Player Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Aarti Details & Author */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 bg-amber-900/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                  Composed by {selectedAarti.author}
                </span>
                {isPlaying && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Singing Aarti Playing</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-sacred text-white">
                {selectedAarti.title}
              </h3>
              <p className="text-xs text-amber-100/90 max-w-xl line-clamp-1">
                {selectedAarti.context}
              </p>
            </div>

            {/* Language Script Toggle */}
            <div className="flex items-center bg-black/25 rounded-full p-1 border border-white/20 text-xs shrink-0 self-end lg:self-center">
              <button
                onClick={() => setDisplayLanguage('devanagari')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  displayLanguage === 'devanagari' ? 'bg-amber-400 text-amber-950 shadow' : 'text-amber-100'
                }`}
              >
                मराठी / देवनागरी
              </button>
              <button
                onClick={() => setDisplayLanguage('english')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  displayLanguage === 'english' ? 'bg-amber-400 text-amber-950 shadow' : 'text-amber-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setDisplayLanguage('meaning')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  displayLanguage === 'meaning' ? 'bg-amber-400 text-amber-950 shadow' : 'text-amber-100'
                }`}
              >
                Meaning
              </button>
            </div>
          </div>

          {/* Audio Playback Controls & Progress Bar */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 space-y-3">
            {/* Scrubber and Time */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-amber-200">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration > 0 ? duration : 100}
                step="0.5"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-amber-950/60 rounded-lg appearance-none cursor-pointer accent-amber-300"
                title="Seek position"
              />
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                {/* PRIMARY PLAY / PAUSE BUTTON */}
                <button
                  id="play-singing-aarti-btn"
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-xl active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 ring-4 ring-amber-400/40'
                      : 'bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 hover:from-amber-200 hover:to-yellow-300 ring-2 ring-white/30'
                  }`}
                  title={isPlaying ? 'Pause Singing Aarti' : 'Play Singing Aarti'}
                >
                  {isLoadingAudio ? (
                    <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                  <span className="text-base font-black">
                    {isLoadingAudio ? 'Loading Aarti...' : isPlaying ? 'Pause Aarti' : 'Play Singing Aarti'}
                  </span>
                </button>

                {/* Restart from Beginning */}
                <button
                  onClick={handleRestart}
                  className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-90"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Ambient Tanpura Drone */}
                <button
                  onClick={handleToggleAmbient}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur transition-all border ${
                    ambientTanpura
                      ? 'bg-amber-400 text-amber-950 border-amber-300 shadow'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                  title="Temple Tanpura acoustic resonance"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Tanpura Drone {ambientTanpura ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Volume Controls */}
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/15">
                <button
                  onClick={handleToggleMute}
                  className="text-amber-200 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-300" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  title="Aarti Volume"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Lyrics Recitation Viewport with Sync Highlighting */}
        <div className="p-6 sm:p-10 space-y-3 max-h-[520px] overflow-y-auto bg-[#fdfbf7]">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100 text-xs text-stone-500">
            <span>Click any lyric line below to jump directly to that point in the singing Aarti</span>
            {isPlaying && (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Karaoke synchronized singing</span>
              </span>
            )}
          </div>

          {selectedAarti.devanagariLyrics.map((devLine, idx) => {
            const isCurrentLine = activeLineIndex === idx;
            const engLine = selectedAarti.englishLyrics[idx] || '';
            const meaningLine = selectedAarti.meaning[idx] || '';

            return (
              <motion.div
                key={idx}
                onClick={() => handleJumpToLine(idx)}
                animate={isCurrentLine ? { scale: 1.01 } : { scale: 1 }}
                className={`p-4 rounded-2xl transition-all duration-300 border cursor-pointer ${
                  isCurrentLine
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
                    : 'bg-white border-amber-100 hover:border-amber-300 hover:bg-amber-50/40'
                }`}
                title="Click to jump singing to this line"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                      isCurrentLine
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    {/* Primary Chosen Script */}
                    {displayLanguage === 'devanagari' && (
                      <div className="text-base sm:text-lg font-bold font-devanagari text-stone-900 leading-relaxed">
                        {devLine}
                      </div>
                    )}

                    {displayLanguage === 'english' && (
                      <div className="text-base sm:text-lg font-bold text-amber-900 leading-relaxed">
                        {engLine}
                      </div>
                    )}

                    {displayLanguage === 'meaning' && (
                      <div className="text-sm sm:text-base font-medium text-stone-800 leading-relaxed">
                        {meaningLine}
                      </div>
                    )}

                    {/* Helpful Secondary Transliteration */}
                    {displayLanguage === 'devanagari' && (
                      <div className="text-xs text-amber-800/80 font-medium italic">
                        {engLine}
                      </div>
                    )}
                    {displayLanguage === 'english' && (
                      <div className="text-xs text-stone-500 font-devanagari">
                        {devLine}
                      </div>
                    )}
                  </div>

                  {isCurrentLine && (
                    <span className="text-xs text-amber-600 font-bold uppercase tracking-wider shrink-0 mt-1">
                      Singing Now
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Guidance */}
        <div className="p-4 bg-amber-50/60 border-t border-amber-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-amber-900">
            ॥ गणपती बाप्पा मोरया, मंगलमूर्ती मोरया ॥
          </span>
          <span className="text-stone-500">
            Traditional Indian instruments: Dhol, Tasha, Ghanta, Sanai & Pakhawaj.
          </span>
        </div>
      </div>
    </section>
  );
};
