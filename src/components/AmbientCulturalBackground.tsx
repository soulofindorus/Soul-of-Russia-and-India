import React from 'react';

/**
 * AmbientCulturalBackground
 * Implements the user-provided authentic artwork as the responsive background
 * of the main page:
 * - Desktop / Widescreen: /backgrounds/main_bg_desktop.jpg
 * - Mobile / Portrait: /backgrounds/main_bg_mobile.jpg
 * Accompanied by delicate celestial starlight particles and smooth transitions.
 */
export const AmbientCulturalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Pearlescent Foundation */}
      <div className="absolute inset-0 bg-[#f4f7fb]" />

      {/* 2. Responsive User Uploaded Artwork according to screen size */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/backgrounds/main_bg_mobile.jpg" />
        <img
          src="/backgrounds/main_bg_desktop.jpg"
          alt="Soul of Russia and India Aurora and Heritage Background"
          className="w-full h-full object-cover object-top opacity-95 transition-opacity duration-700"
        />
      </picture>

      {/* 3. Soft Ambient Luminous Mist (Ensures High Contrast & Readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40 pointer-events-none" />

      {/* 4. Delicate Floating Celestial Starlight & Crystalline Dust */}
      <div className="absolute inset-0">
        <span
          className="absolute top-[18%] left-[14%] w-1.5 h-1.5 rounded-full bg-teal-400/50 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="absolute top-[26%] right-[22%] w-1.5 h-1.5 rounded-full bg-blue-400/45 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '2.5s' }}
        />
        <span
          className="absolute top-[44%] left-[10%] w-1 h-1 rounded-full bg-amber-400/40 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '4.2s' }}
        />
        <span
          className="absolute top-[62%] right-[16%] w-1.5 h-1.5 rounded-full bg-orange-400/45 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-[78%] left-[24%] w-1 h-1 rounded-full bg-emerald-400/40 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '5.8s' }}
        />
        <span
          className="absolute top-[88%] right-[28%] w-1.5 h-1.5 rounded-full bg-amber-400/50 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '3.1s' }}
        />
      </div>

      {/* 5. Subtle Intercultural Border Filigree Lines (Top & Bottom) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </div>
  );
};
