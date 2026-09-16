import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  Sparkles,
  Check,
  Copy,
  Award,
  Heart,
  Palette
} from 'lucide-react';

interface SwaroopOption {
  id: string;
  name: string;
  marathiName: string;
  shloka: string;
  shlokaMeaning: string;
}

const SWAROOP_OPTIONS: SwaroopOption[] = [
  {
    id: 'siddhivinayak',
    name: 'Shree Siddhivinayak (Prabhadevi, Mumbai)',
    marathiName: 'श्री सिद्धिविनायक',
    shloka: '॥ ॐ गं गणपतये नमः • सिद्धिविनायक नमो नमः ॥',
    shlokaMeaning: 'Grantor of all Siddhis (spiritual accomplishments) and supreme success.',
  },
  {
    id: 'lalbaug',
    name: 'Lalbaugcha Raja (Navsacha Ganpati)',
    marathiName: 'लालबागचा राजा',
    shloka: '॥ नवसाला पावणारा लालबागचा राजा • मोरया ॥',
    shlokaMeaning: 'The King of Lalbaug, fulfilling every sincere prayer and solemn wish.',
  },
  {
    id: 'dagdusheth',
    name: 'Shrimant Dagdusheth Halwai Ganpati (Pune)',
    marathiName: 'श्रीमंत दगडूशेठ हलवाई गणपती',
    shloka: '॥ श्रीमंत दगडूशेठ गणपती बाप्पा मोरया ॥',
    shlokaMeaning: 'Bestower of boundless wisdom, wealth, and family well-being.',
  },
  {
    id: 'vighnaharta',
    name: 'Vighnaharta Mayureshwar (Morgaon)',
    marathiName: 'मयूरेश्वर विघ्नहर्ता',
    shloka: '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    shlokaMeaning: 'May Lord of infinite brilliance remove all obstacles from every endeavor.',
  },
];

const SANKALPA_OPTIONS = [
  {
    id: 'vidya',
    title: 'विद्या, ज्ञान व स्पर्धा परीक्षा यश (Wisdom & Academic Success)',
    text: 'हे विघ्नहर्त्या गणराया, मजवर अखंड बुद्धी, ज्ञान व विद्या प्रगतीचा कृपावर्षाव असू दे.',
  },
  {
    id: 'samruddhi',
    title: 'सुख, समृद्धी व आर्थिक स्थैर्य (Prosperity, Peace & Wealth)',
    text: 'हे मंगलमूर्ती, आमच्या संपूर्ण परिवारात अखंड सुख, शांती, धनधान्य व समृद्धी नांदू दे.',
  },
  {
    id: 'arogya',
    title: 'निरोगी दीर्घायुष्य व आरोग्य (Health, Healing & Longevity)',
    text: 'हे गणेशा, सर्व व्याधी व चिंतांचे हरण करून संपूर्ण कुळाला उत्तम आरोग्य व दीर्घायुष्य लाभो.',
  },
  {
    id: 'karyasiddhi',
    title: 'नवीन कार्यसिद्धी व विघ्नहरण (Success in New Venture & Obstacle Removal)',
    text: 'हे सिद्धिविनायका, सुरु केलेल्या सर्व शुभ संकल्पांना यश प्राप्त होऊन सर्व विघ्ने नष्ट होवोत.',
  },
];

const CARD_THEMES = [
  {
    id: 'royal-gold',
    name: 'Royal Gold (सुवर्ण)',
    bgGradient: 'from-amber-950 via-stone-900 to-amber-950',
    borderColor: '#f59e0b',
    textColor: '#fef08a',
    accentColor: '#d97706',
  },
  {
    id: 'marigold-saffron',
    name: 'Festive Saffron (केशरी)',
    bgGradient: 'from-orange-900 via-amber-950 to-red-950',
    borderColor: '#ea580c',
    textColor: '#ffedd5',
    accentColor: '#f97316',
  },
  {
    id: 'sandalwood-cream',
    name: 'Chandan Serenity (चंदन)',
    bgGradient: 'from-[#291e14] via-[#1a120b] to-[#291e14]',
    borderColor: '#ca8a04',
    textColor: '#fef3c7',
    accentColor: '#eab308',
  },
];

export const GaneshBlessingCardSection: React.FC = () => {
  const [devoteeName, setDevoteeName] = useState('Rahul & Family');
  const [gotra, setGotra] = useState('Kashyap / All Devotees');
  const [selectedSwaroop, setSelectedSwaroop] = useState(SWAROOP_OPTIONS[0]);
  const [selectedSankalpa, setSelectedSankalpa] = useState(SANKALPA_OPTIONS[0]);
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate Canvas preview whenever parameters change
  useEffect(() => {
    drawCardOnCanvas();
  }, [devoteeName, gotra, selectedSwaroop, selectedSankalpa, selectedTheme]);

  const drawCardOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution card: 1200 x 800
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (selectedTheme.id === 'royal-gold') {
      bgGrad.addColorStop(0, '#1c1309');
      bgGrad.addColorStop(0.5, '#2e1c0c');
      bgGrad.addColorStop(1, '#170e06');
    } else if (selectedTheme.id === 'marigold-saffron') {
      bgGrad.addColorStop(0, '#2b0e07');
      bgGrad.addColorStop(0.5, '#3b140a');
      bgGrad.addColorStop(1, '#1f0804');
    } else {
      bgGrad.addColorStop(0, '#19120c');
      bgGrad.addColorStop(0.5, '#291b10');
      bgGrad.addColorStop(1, '#150d06');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Radial Glow in Center
    const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 450);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Royal Gold Borders
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner Delicate Filigree Border
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(42, 42);
    drawCorner(width - 42, 42);
    drawCorner(42, height - 42);
    drawCorner(width - 42, height - 42);

    // 4. Top Sacred Header
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Noto Sans Devanagari", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ श्री गणेशाय नमः • ॐ गं गणपतये नमः ॥', width / 2, 90);

    // Auspicious Marigold Garlands decoration text
    ctx.fillStyle = '#fb923c';
    ctx.font = '16px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('🪷 • 🌺 • 🪷 • 🌺 • 🪷 • 🌺 • 🪷 • 🌺 • 🪷 • 🌺 • 🪷', width / 2, 120);

    // 5. Title & Deity Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Playfair Display", "Noto Sans Devanagari", serif';
    ctx.fillText(selectedSwaroop.name, width / 2, 175);

    ctx.fillStyle = '#facc15';
    ctx.font = 'italic 20px "Noto Sans Devanagari", serif';
    ctx.fillText(selectedSwaroop.shloka, width / 2, 215);

    // 6. Center Decorative Box for Sankalpa & Blessing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 2;
    const boxX = 120;
    const boxY = 250;
    const boxW = width - 240;
    const boxH = 340;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Devotee Name Ribbon
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('॥ आदरणीय भक्त परिवार (Devotee & Family) ॥', width / 2, boxY + 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Noto Sans Devanagari", serif';
    ctx.fillText(devoteeName || 'सकल भक्तजन', width / 2, boxY + 95);

    if (gotra) {
      ctx.fillStyle = '#fef3c7';
      ctx.font = '16px "Noto Sans Devanagari", sans-serif';
      ctx.fillText(`गोत्र / कुळ: ${gotra}`, width / 2, boxY + 125);
    }

    // Sacred Divider Line
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, boxY + 145);
    ctx.lineTo(width / 2 + 180, boxY + 145);
    ctx.stroke();

    // Sacred Sankalpa Text
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 20px "Noto Sans Devanagari", serif';
    ctx.fillText(`संकल्प: ${selectedSankalpa.title}`, width / 2, boxY + 185);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(`"${selectedSankalpa.text}"`, width / 2, boxY + 235);

    // Official Darshan Blessing Seal
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 18px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('✨ गणपती बाप्पाच्या कृपेने आपले सर्व मनोरथ सिद्धीस जावोत! ✨', width / 2, boxY + 290);

    // 7. Footer Seal & Date
    const today = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    ctx.fillStyle = '#d6d3d1';
    ctx.font = '15px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(`तारीख: ${today} • पवित्र गणेश दर्शन पत्रिका`, width / 2, height - 90);

    ctx.fillStyle = '#ca8a04';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('SHREE GANESH DARSHAN & BIOGRAPHY SANCTUARY', width / 2, height - 65);
  };

  const downloadCard = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    // Trigger celebration confetti!
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#eab308'],
    });

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `Ganesh-Blessing-Card-${devoteeName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGenerating(false);
    }, 400);
  };

  const copyBlessingsText = () => {
    const text = `॥ श्री गणेशाय नमः ॥\n\n` +
      `🌺 ${selectedSwaroop.name} 🌺\n` +
      `${selectedSwaroop.shloka}\n\n` +
      `भक्त नाव: ${devoteeName}\n` +
      `संकल्प: ${selectedSankalpa.title}\n` +
      `प्रार्थना: "${selectedSankalpa.text}"\n\n` +
      `✨ बाप्पाच्या चरणी नतमस्तक होऊन आपले सर्व मनोरथ पूर्ण होवोत हीच मंगल कामना! ✨\n` +
      `गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-400/50">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider text-amber-100 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>वैयक्तिक डिजिटल दर्शन व आशीर्वाद पत्रिका • Personal Blessing Card</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-serif-sacred text-white tracking-tight">
            Ganesh E-Darshan & Sankalpa Studio
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl font-devanagari leading-relaxed">
            स्वतःच्या किंवा परिवाराच्या नावे श्री गणेशाची मंगलमय दर्शन पत्रिका तयार करा, संकल्प जोडा आणि उच्च गुणवत्तेचे कार्ड डाऊनलोड करून आप्तस्वकीयांसोबत शेअर करा.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-amber-200 dark:border-amber-800 shadow-sm">
          <h3 className="text-lg font-black font-devanagari text-amber-950 dark:text-amber-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-600" />
            <span>पत्रिका सानुकूल करा (Personalize Card)</span>
          </h3>

          {/* 1. Devotee Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              आपले नाव / परिवार (Devotee / Family Name):
            </label>
            <input
              type="text"
              value={devoteeName}
              onChange={(e) => setDevoteeName(e.target.value)}
              placeholder="उदा. राहुल, स्नेहा आणि परिवार"
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 2. Gotra / Native Place */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              गोत्र किंवा गाव / शहर (Gotra or City - Optional):
            </label>
            <input
              type="text"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              placeholder="उदा. कश्यप / पुणे / मुंबई"
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 3. Choose Bappa Swaroop */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              आराध्य दैवत स्वरूप (Lord Ganesha Swaroop):
            </label>
            <div className="space-y-2">
              {SWAROOP_OPTIONS.map((swaroop) => (
                <button
                  key={swaroop.id}
                  onClick={() => setSelectedSwaroop(swaroop)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedSwaroop.id === swaroop.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 font-bold shadow-sm'
                      : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-devanagari text-sm font-black text-amber-900 dark:text-amber-200">
                      {swaroop.marathiName}
                    </div>
                    <div className="text-[11px] opacity-75">{swaroop.name}</div>
                  </div>
                  {selectedSwaroop.id === swaroop.id && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Choose Sankalpa (Wish/Prayer) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              शुभ संकल्प (Choose Auspicious Sankalpa):
            </label>
            <div className="space-y-2">
              {SANKALPA_OPTIONS.map((sankalpa) => (
                <button
                  key={sankalpa.id}
                  onClick={() => setSelectedSankalpa(sankalpa)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedSankalpa.id === sankalpa.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 font-bold shadow-sm'
                      : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="font-devanagari font-bold">{sankalpa.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Theme Palette */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              पत्रिका रंगसंगती (Card Theme):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    selectedTheme.id === theme.id
                      ? 'border-amber-500 bg-amber-600 text-white shadow'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW & DOWNLOAD ACTIONS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-amber-200 dark:border-amber-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black font-devanagari text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <span>🪷</span>
                <span>थेट पत्रिका पूर्वावलोकन (Live 300DPI Card Preview)</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full">
                1200 x 800 PNG
              </span>
            </div>

            {/* Canvas Container with smooth scaling */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/80 bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block transform origin-top"
                style={{ maxHeight: '460px', objectFit: 'contain' }}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                id="download-card-png-btn"
                onClick={downloadCard}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-lg shadow-orange-900/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'कार्ड तयार होत आहे...' : 'Download High-Res Card (PNG)'}</span>
              </button>

              <button
                id="copy-blessings-text-btn"
                onClick={copyBlessingsText}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 font-bold text-xs sm:text-sm active:scale-95 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'आशीर्वाद कॉपी झाले! (Copied)' : 'Copy Blessings Text'}</span>
              </button>
            </div>
          </div>

          {/* SPIRITUAL SIGNIFICANCE CARD */}
          <div className="bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-xs sm:text-sm space-y-2 text-stone-700 dark:text-stone-300">
            <h4 className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              संकल्प व आशीर्वाद पत्रिकेचे महत्त्व (Vedic Importance):
            </h4>
            <p className="leading-relaxed">
              In traditional Vedic worship, taking a <strong>Sankalpa (संकल्प)</strong> directs the divine energy of your prayers towards a focused sacred purpose.
              Sharing Lord Ganesha's blessings brings joy and auspiciousness (मंगल) to friends, relatives, and loved ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
