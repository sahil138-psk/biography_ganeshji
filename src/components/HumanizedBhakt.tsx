import React from 'react';
import { motion } from 'motion/react';

interface HumanizedBhaktProps {
  isBlessed?: boolean;
  slideProgress?: number;
}

export const HumanizedBhakt: React.FC<HumanizedBhaktProps> = ({
  isBlessed = false,
  slideProgress = 0,
}) => {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Divine Golden Halo / Aura when blessed */}
      {isBlessed && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute -top-4 w-32 h-44 rounded-full bg-gradient-to-b from-yellow-300/40 via-amber-400/20 to-transparent blur-md -z-10"
        />
      )}

      {/* SVG Character of Devoted Indian Bhakt */}
      <svg
        viewBox="0 0 120 220"
        className="w-24 h-44 sm:w-28 sm:h-48 drop-shadow-xl overflow-visible"
        aria-label="Humanized Devotee Bhakt"
      >
        <defs>
          {/* Skin Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffdfc9" />
            <stop offset="100%" stopColor="#f3be9b" />
          </linearGradient>

          {/* Saffron Kurta Gradient */}
          <linearGradient id="kurtaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Maharashtrian Pheta / Turban Gradient */}
          <linearGradient id="phetaGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="40%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#b43403" />
          </linearGradient>

          {/* Gold Zari Border */}
          <linearGradient id="goldZari" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Dhoti / Silk Gradient */}
          <linearGradient id="dhotiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          {/* Angavastram Maroon/Red Stole */}
          <linearGradient id="stoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Drop shadow for clothes */}
          <filter id="bhaktShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#451a03" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. FEET WITH AUSPICIOUS ALTA / KUMKUM */}
        <g id="bhakt-feet">
          {/* Left Foot */}
          <ellipse cx="48" cy="208" rx="7" ry="4" fill="url(#skinGrad)" />
          {/* Right Foot */}
          <ellipse cx="72" cy="208" rx="7" ry="4" fill="url(#skinGrad)" />
          {/* Auspicious red alta border on feet */}
          <path d="M 43 209 Q 48 211 53 209" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M 67 209 Q 72 211 77 209" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.8" />
        </g>

        {/* 2. DHOTI (TRADITIONAL SILK PLEATED DHOTAR) */}
        <g id="bhakt-dhoti" filter="url(#bhaktShadow)">
          {/* Main Dhoti Silhouette */}
          <path
            d="M 40 145 Q 36 175 42 205 L 56 205 Q 52 175 60 148 Q 68 175 64 205 L 78 205 Q 84 175 80 145 Z"
            fill="url(#dhotiGrad)"
            stroke="#e2d097"
            strokeWidth="0.75"
          />
          {/* Central Pleats (काष्टा / चुण्या) */}
          <path d="M 57 148 L 54 204" stroke="#d4b470" strokeWidth="1" strokeDasharray="2 1" />
          <path d="M 63 148 L 66 204" stroke="#d4b470" strokeWidth="1" strokeDasharray="2 1" />
          <path d="M 60 148 L 60 205" stroke="#b48c45" strokeWidth="1.2" />

          {/* Golden Zari Hem Border on Dhoti */}
          <rect x="42" y="202" width="14" height="3" rx="1" fill="url(#goldZari)" />
          <rect x="64" y="202" width="14" height="3" rx="1" fill="url(#goldZari)" />
        </g>

        {/* 3. UPPER BODY: SAFFRON KURTA & ANTHROPOMORPHIC TORSO */}
        <g id="bhakt-kurta" filter="url(#bhaktShadow)">
          {/* Kurta Body */}
          <path
            d="M 32 96 L 38 152 Q 60 156 82 152 L 88 96 Q 60 90 32 96 Z"
            fill="url(#kurtaGrad)"
          />

          {/* Kurta Hem Golden Border */}
          <path
            d="M 38 150 Q 60 154 82 150 L 82 152 Q 60 156 38 152 Z"
            fill="url(#goldZari)"
          />

          {/* Side Slits on Kurta */}
          <line x1="39" y1="138" x2="39" y2="152" stroke="#9a3412" strokeWidth="1.5" />
          <line x1="81" y1="138" x2="81" y2="152" stroke="#9a3412" strokeWidth="1.5" />

          {/* Traditional Placket / Buttons */}
          <line x1="60" y1="88" x2="60" y2="120" stroke="#7c2d12" strokeWidth="1" />
          <circle cx="60" cy="94" r="1.2" fill="url(#goldZari)" />
          <circle cx="60" cy="102" r="1.2" fill="url(#goldZari)" />
          <circle cx="60" cy="110" r="1.2" fill="url(#goldZari)" />
          <circle cx="60" cy="118" r="1.2" fill="url(#goldZari)" />

          {/* Uttariya / Angavastram (उपरणे) draped over left shoulder */}
          <path
            d="M 40 92 Q 48 118 78 144 L 84 140 Q 56 112 48 88 Z"
            fill="url(#stoleGrad)"
            opacity="0.95"
          />
          {/* Golden Zari trim on the stole */}
          <path
            d="M 39 92 Q 47 118 77 144"
            stroke="url(#goldZari)"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* 4. NECK & SACRED JEWELRY */}
        <g id="bhakt-neck">
          {/* Neck with soft anatomical contour */}
          <path d="M 52 70 L 52 88 Q 60 92 68 88 L 68 70 Z" fill="url(#skinGrad)" />
          {/* Shadow under chin */}
          <path d="M 52 70 Q 60 76 68 70 Z" fill="#d97706" opacity="0.25" />

          {/* Kurta Nehru Collar */}
          <path
            d="M 48 84 Q 60 90 72 84 L 71 88 Q 60 94 49 88 Z"
            fill="#c2410c"
            stroke="url(#goldZari)"
            strokeWidth="0.75"
          />

          {/* Sacred Rudraksha Beads Mala */}
          <path
            d="M 50 82 Q 60 102 70 82"
            stroke="#78350f"
            strokeWidth="1.8"
            strokeDasharray="2 1.5"
            fill="none"
          />
          {/* Gold Pendant at bottom of mala */}
          <circle cx="60" cy="97" r="2.2" fill="url(#goldZari)" />
        </g>

        {/* 5. ARMS & FOLDED HANDS IN NAMASTE (ANJALI MUDRA) */}
        <g id="bhakt-arms">
          {/* Left Sleeve & Forearm */}
          <path
            d="M 32 96 Q 22 115 42 125 L 48 119 Q 34 112 40 98 Z"
            fill="url(#kurtaGrad)"
            filter="url(#bhaktShadow)"
          />
          {/* Left Sleeve Gold Cuff */}
          <ellipse cx="46" cy="122" rx="4" ry="2" fill="url(#goldZari)" />

          {/* Right Sleeve & Forearm */}
          <path
            d="M 88 96 Q 98 115 78 125 L 72 119 Q 86 112 80 98 Z"
            fill="url(#kurtaGrad)"
            filter="url(#bhaktShadow)"
          />
          {/* Right Sleeve Gold Cuff */}
          <ellipse cx="74" cy="122" rx="4" ry="2" fill="url(#goldZari)" />

          {/* Left Wrist with Sacred Red Kalawa Thread */}
          <rect x="49" y="117" width="3" height="4" rx="1" fill="#dc2626" />

          {/* Right Wrist with Gold Kada */}
          <rect x="68" y="117" width="3" height="4" rx="1" fill="url(#goldZari)" />

          {/* JOINED HANDS IN PRANAM / NAMASTE 🙏 */}
          <g id="folded-namaste-hands" filter="url(#bhaktShadow)">
            {/* Left Palm & Fingers */}
            <path
              d="M 52 122 C 52 116 57 106 59 101 C 60 100 61 100 61 101 L 61 124 C 57 125 53 124 52 122 Z"
              fill="url(#skinGrad)"
            />
            {/* Right Palm & Fingers */}
            <path
              d="M 68 122 C 68 116 63 106 61 101 C 60 100 59 100 59 101 L 59 124 C 63 125 67 124 68 122 Z"
              fill="url(#skinGrad)"
            />

            {/* Finger Contours */}
            <line x1="58" y1="103" x2="57" y2="114" stroke="#c27d53" strokeWidth="0.6" />
            <line x1="62" y1="103" x2="63" y2="114" stroke="#c27d53" strokeWidth="0.6" />

            {/* Joining seam between palms */}
            <line x1="60" y1="101" x2="60" y2="124" stroke="#c27d53" strokeWidth="0.8" />
          </g>
        </g>

        {/* 6. REALISTIC DEVOTIONAL HEAD & SERENE HUMAN FACE */}
        <g id="bhakt-face">
          {/* Left Ear */}
          <path d="M 44 48 C 40 48 40 58 44 60 Z" fill="url(#skinGrad)" />
          {/* Gold Kundal / Earring on Left Ear */}
          <circle cx="43" cy="56" r="1.5" fill="url(#goldZari)" />

          {/* Right Ear */}
          <path d="M 76 48 C 80 48 80 58 76 60 Z" fill="url(#skinGrad)" />
          {/* Gold Kundal / Earring on Right Ear */}
          <circle cx="77" cy="56" r="1.5" fill="url(#goldZari)" />

          {/* Human Face Shape with soft jawline and chin */}
          <path
            d="M 44 44 C 44 28 76 28 76 44 C 76 56 70 70 60 71 C 50 70 44 56 44 44 Z"
            fill="url(#skinGrad)"
            filter="url(#bhaktShadow)"
          />

          {/* Subtle Rosy Cheeks */}
          <circle cx="49" cy="55" r="3.5" fill="#f87171" opacity="0.25" />
          <circle cx="71" cy="55" r="3.5" fill="#f87171" opacity="0.25" />

          {/* Serene Gently Curved Eyebrows */}
          <path d="M 48 45 Q 53 42 57 45" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 63 45 Q 67 42 72 45" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Serene Closed Eyes (Devotional Dhyana Expression) */}
          <path
            d="M 48 51 Q 53 55 57 51"
            stroke="#451a03"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 63 51 Q 67 55 72 51"
            stroke="#451a03"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Graceful Nose Line */}
          <path d="M 60 45 L 60 56 Q 62 58 63 56" stroke="#c27d53" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Gentle Peaceful Devotional Smile */}
          <path
            d="M 54 62 Q 60 66 66 62"
            stroke="#991b1b"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* SACRED FOREHEAD TILAK: White Chandan crescent with Red Kumkum/Sindoor */}
          {/* Sandalwood Chandan crescent base */}
          <path d="M 55 42 Q 60 45 65 42" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Vermilion Sindoor Urdhva Tilak */}
          <path d="M 59 34 L 61 34 L 60.5 42 L 59.5 42 Z" fill="#dc2626" />
          <circle cx="60" cy="42" r="1.2" fill="#dc2626" />
        </g>

        {/* 7. AUTHENTIC MAHARASHTRIAN PHETA (ROYAL SAFFRON TURBAN) */}
        <g id="bhakt-pheta" filter="url(#bhaktShadow)">
          {/* Main Turban Body / Swirls */}
          <path
            d="M 42 42 C 40 30 45 20 60 18 C 75 20 80 30 78 42 C 75 36 67 33 60 33 C 53 33 45 36 42 42 Z"
            fill="url(#phetaGrad)"
          />

          {/* Folded Saffron Pleats (पगडीच्या घड्या) */}
          <path
            d="M 41 38 C 48 30 72 30 79 38 C 76 33 68 30 60 30 C 52 30 44 33 41 38 Z"
            fill="#ea580c"
          />
          <path
            d="M 43 32 C 50 25 70 25 77 32 C 74 27 67 24 60 24 C 53 24 46 27 43 32 Z"
            fill="#f97316"
          />

          {/* Traditional Royal Kalgi / Crest Brooch in Center */}
          <path d="M 60 14 L 62 20 L 58 20 Z" fill="url(#goldZari)" />
          <circle cx="60" cy="21" r="2.5" fill="url(#goldZari)" />
          <circle cx="60" cy="21" r="1.2" fill="#dc2626" />

          {/* Turban Tail (शिरपेच / पदर) flowing gently to the left shoulder */}
          <path
            d="M 42 34 C 38 36 34 46 36 56 C 37 57 40 55 40 53 C 38 46 41 38 43 34 Z"
            fill="url(#phetaGrad)"
          />
          {/* Gold zari fringe at tail end */}
          <path d="M 36 55 L 40 52" stroke="url(#goldZari)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
