import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Heart, RotateCcw } from 'lucide-react';
import { playTempleBell, playCymbal } from '../utils/audioSynthesizer';

interface Blessing {
  shloka: string;
  transliteration: string;
  meaning: string;
  blessingMessage: string;
  modakType: string;
}

const BLESSINGS: Blessing[] = [
  {
    shloka: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    transliteration: 'Vakratunda Mahakaya Suryakoti Samaprabha | Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada ||',
    meaning: 'O Lord with the curved trunk and immense cosmic body, radiating with the brilliance of a million suns: please remove all obstacles from my endeavors, forever.',
    blessingMessage: 'Bappa removes all unseen impediments from your path today. Move forward with fearlessness and unshakeable clarity.',
    modakType: 'Golden Modak of Obstacle Removal'
  },
  {
    shloka: 'एकदन्तं महाकायं तप्तकाञ्चनसप्रभम् । लम्ब Spinोदरं विशालाक्षं वन्देऽहं गणनायकम् ॥',
    transliteration: 'Ekadantam Mahakayam Taptakanchana-saprabham | Lambodaram Vishalaksham Vande-ham Gananayakam ||',
    meaning: 'I bow to the single-tusked leader of all beings, glowing like molten gold, with vast eyes and a boundless heart.',
    blessingMessage: 'Your sincere hard work will bear sweet spiritual and material fruits. Divine abundance and peace are flowing to you.',
    modakType: 'Kesari Modak of Prosperity'
  },
  {
    shloka: 'प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् । भक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये ॥',
    transliteration: 'Pranamya Shirasa Devam Gauriputram Vinayakam | Bhaktavasam Smaren-nityam Ayuh-kama-artha-siddhaye ||',
    meaning: 'Bowing our head before the son of Mother Gauri, Vinayaka, who resides in the hearts of his devotees, granting longevity, health, and fulfillment of noble aims.',
    blessingMessage: 'Cultivate calmness in times of chaos. Keep your ears open for wisdom and your tongue restrained in humility.',
    modakType: 'Maha Modak of Divine Wisdom'
  },
  {
    shloka: 'अगजानन पद्मार्कं गजाननमहर्निशम् । अनेकदं तं भक्तानामेकदन्तमुपास्महे ॥',
    transliteration: 'Agajanana Padmarkam Gajananama-harnisham | Anekadam Tam Bhaktanam Ekadantam Upasmahe ||',
    meaning: 'Just as the rising sun causes the lotus to bloom, Gajanana brings boundless joy to Mother Parvati. We meditate on the single-tusked Lord who grants multiple boons.',
    blessingMessage: 'You are under the direct protection of Lord Gajanana. Have faith in the divine timing of your life.',
    modakType: 'Chandan Modak of Peace'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBlessingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [opened, setOpened] = useState(false);
  const [blessingIndex, setBlessingIndex] = useState(0);

  const handleOpenModak = () => {
    setOpened(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fbbf24', '#f97316']
    });
  };

  const handlePickAnother = () => {
    setBlessingIndex((prev) => (prev + 1) % BLESSINGS.length);
    setOpened(false);
  };

  const currentBlessing = BLESSINGS[blessingIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 p-6 sm:p-8 space-y-6 text-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="text-xs uppercase font-bold text-amber-600 tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>बाप्पाचा दैवी प्रसाद</span>
          </div>
          <h3 className="text-2xl font-bold font-serif-sacred text-stone-900">
            Bappa’s Modak of Wisdom & Blessing
          </h3>
          <p className="text-xs text-stone-500">
            Tap the sacred modak to crack it open and reveal today’s divine guidance.
          </p>
        </div>

        {!opened ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <motion.button
              onClick={handleOpenModak}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-2xl flex items-center justify-center text-6xl cursor-pointer border-4 border-amber-100 animate-bounce"
              title="Click to open!"
            >
              🥟
            </motion.button>
            <div className="text-xs font-bold text-amber-800 animate-pulse">
              Tap the Modak to Open ✨
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-200/60 px-3 py-0.5 rounded-full">
                {currentBlessing.modakType}
              </span>
              <div className="text-base sm:text-lg font-bold font-devanagari text-stone-900 leading-snug">
                {currentBlessing.shloka}
              </div>
              <div className="text-xs text-amber-800 italic">
                {currentBlessing.transliteration}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl border-l-4 border-orange-500 text-xs sm:text-sm text-stone-800 space-y-1">
              <div className="font-bold text-orange-950 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Today’s Divine Blessing from Bappa</span>
              </div>
              <p className="leading-relaxed">
                {currentBlessing.blessingMessage}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePickAnother}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pick Another Modak</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow"
              >
                Accept with Gratitude 🙏
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
