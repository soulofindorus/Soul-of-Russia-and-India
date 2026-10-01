import React from 'react';

/**
 * AmbientCulturalBackground
 * A luminous, atmospheric light background celebrating the cultural bridge
 * between Russia and India. Features ethereal ribbons of the Northern Lights
 * (Aurora Borealis: emerald, arctic cyan, polar violet) blending with Indian
 * morning Surya warmth (saffron, apricot, golden dawn), along with delicate
 * cultural watermarks and floating starlight motes.
 */
export const AmbientCulturalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Luminous Arctic & Surya Sky Foundation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e9f2f8] via-[#f1f6fb] to-[#fbf7f0]" />

      {/* 2. Living Northern Lights (Aurora Borealis) Ribbons */}
      {/* Aurora Ribbon 1: Polar Mint & Boreal Emerald (North-West / Top-Left) */}
      <div className="absolute -top-36 -left-20 w-[42rem] sm:w-[60rem] h-[32rem] sm:h-[42rem] rounded-full bg-gradient-to-r from-emerald-400/20 via-teal-300/25 to-cyan-400/20 blur-[90px] animate-aurora-slow opacity-90" />
      
      {/* Aurora Ribbon 2: Arctic Cyan & Glacial Sky (Top-Center) */}
      <div className="absolute -top-10 left-1/4 w-[36rem] sm:w-[50rem] h-[26rem] sm:h-[34rem] rounded-full bg-gradient-to-br from-cyan-400/20 via-sky-300/25 to-blue-400/15 blur-[95px] animate-aurora-reverse opacity-85" />

      {/* Aurora Ribbon 3: Polar Twilight Violet & Lapis Radiance (Top-Right) */}
      <div className="absolute -top-20 right-0 w-[32rem] sm:w-[46rem] h-[28rem] sm:h-[36rem] rounded-full bg-gradient-to-bl from-indigo-300/20 via-purple-300/20 to-sky-200/15 blur-[100px] animate-pulse-gentle opacity-80" />

      {/* 3. Indian Surya Dawn & Sacred Golden Sunlight (South-East / Bottom-Right) */}
      <div className="absolute -bottom-32 -right-16 w-[38rem] sm:w-[54rem] h-[34rem] sm:h-[44rem] rounded-full bg-gradient-to-tl from-amber-400/25 via-orange-300/20 to-yellow-200/15 blur-[105px] animate-aurora-slow opacity-90" />
      
      {/* Soft Marigold & Lotus Saffron Hearth (Bottom-Left) */}
      <div className="absolute -bottom-24 left-1/4 w-[30rem] sm:w-[42rem] h-[24rem] sm:h-[30rem] rounded-full bg-gradient-to-tr from-orange-300/15 via-amber-200/20 to-transparent blur-[90px] animate-aurora-reverse opacity-75" />

      {/* Central Golden Civilizational Bridge Hearth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] sm:w-[48rem] h-[24rem] sm:h-[30rem] rounded-full bg-gradient-to-r from-teal-200/15 via-amber-300/20 to-orange-200/15 blur-[120px]" />

      {/* 4. Delicate Cultural Watermarks (Faint & Refined: ~5% Opacity) */}
      {/* Slavic / Russian Traditional Solar Rosette & Dome Archetype (Left) */}
      <div className="absolute top-36 -left-10 sm:left-6 w-72 sm:w-96 h-72 sm:h-96 opacity-[0.06] text-blue-900">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full animate-spin-ultra-slow">
          {/* Outer Sun Wheel */}
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="76" />
          <circle cx="100" cy="100" r="62" strokeDasharray="6 3" />
          {/* Traditional Slavic 8-pointed star / Rosette */}
          <path d="M 100 10 L 125 75 L 190 100 L 125 125 L 100 190 L 75 125 L 10 100 L 75 75 Z" />
          <path d="M 36 36 L 100 64 L 164 36 L 136 100 L 164 164 L 100 136 L 36 164 L 64 100 Z" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="28" />
          {/* Onion dome apex hint */}
          <path d="M 100 72 C 100 86 114 100 100 114 C 86 100 100 86 100 72 Z" />
        </svg>
      </div>

      {/* Indian Sacred Mandala & Lotus Chakra (Right) */}
      <div className="absolute bottom-32 -right-10 sm:right-8 w-80 sm:w-[26rem] h-80 sm:h-[26rem] opacity-[0.065] text-amber-800">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full animate-spin-reverse-ultra-slow">
          {/* Outer Concentric Rims */}
          <circle cx="100" cy="100" r="92" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="82" />
          <circle cx="100" cy="100" r="68" strokeDasharray="2 3" />
          {/* 12 Radiant Lotus Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={deg}
              d="M 100 32 C 112 55 116 75 100 100 C 84 75 88 55 100 32 Z"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
          {/* Inner Chakra Hub */}
          <circle cx="100" cy="100" r="30" />
          <circle cx="100" cy="100" r="14" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* 5. Delicate Celestial Starlight & Crystalline Dust */}
      <div className="absolute inset-0">
        <span
          className="absolute top-[18%] left-[14%] w-1.5 h-1.5 rounded-full bg-teal-500/40 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="absolute top-[26%] right-[18%] w-1.5 h-1.5 rounded-full bg-blue-500/35 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '2.5s' }}
        />
        <span
          className="absolute top-[44%] left-[10%] w-1 h-1 rounded-full bg-amber-600/35 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '4.2s' }}
        />
        <span
          className="absolute top-[62%] right-[12%] w-1.5 h-1.5 rounded-full bg-orange-500/40 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-[78%] left-[20%] w-1 h-1 rounded-full bg-emerald-500/35 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '5.8s' }}
        />
        <span
          className="absolute top-[88%] right-[28%] w-1.5 h-1.5 rounded-full bg-amber-500/45 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '3.1s' }}
        />
      </div>

      {/* 6. Subtle Intercultural Border Filigree Lines (Top & Bottom) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </div>
  );
};
