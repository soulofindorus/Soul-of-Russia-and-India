import React from 'react';

/**
 * AmbientCulturalBackground
 * Renders the user-provided artwork as the primary atmospheric background:
 * - Desktop / Widescreen: Horizontal artwork (/backgrounds/main_bg_desktop.jpg)
 * - Mobile & Tablet: Vertical artwork (/backgrounds/main_bg_mobile.jpg)
 * Positioned at z-0 with full visibility so viewers see the glowing northern lights,
 * St. Basil's onion domes, Taj Mahal silhouette, and sacred mandalas directly behind the content.
 */
export const AmbientCulturalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Responsive Artwork according to size: Vertical for Mobile & Tablet, Horizontal for Desktop */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Tablet & Mobile (screens <= 1024px or portrait orientation) */}
        <source media="(max-width: 1024px)" srcSet="/backgrounds/main_bg_mobile.jpg" />
        <source media="(orientation: portrait)" srcSet="/backgrounds/main_bg_mobile.jpg" />
        {/* Desktop widescreen */}
        <img
          src="/backgrounds/main_bg_desktop.jpg"
          alt="Soul of Russia and India Aurora and Heritage Background"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Gentle Floating Celestial Starlight Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <span
          className="absolute top-[16%] left-[12%] w-2 h-2 rounded-full bg-teal-400/60 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="absolute top-[22%] right-[20%] w-2 h-2 rounded-full bg-blue-400/50 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '2.5s' }}
        />
        <span
          className="absolute top-[42%] left-[8%] w-1.5 h-1.5 rounded-full bg-amber-400/55 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '4.2s' }}
        />
        <span
          className="absolute top-[60%] right-[14%] w-2 h-2 rounded-full bg-orange-400/55 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-[76%] left-[22%] w-1.5 h-1.5 rounded-full bg-emerald-400/50 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '5.8s' }}
        />
        <span
          className="absolute top-[86%] right-[25%] w-2 h-2 rounded-full bg-amber-400/60 blur-[0.5px] animate-float-slow"
          style={{ animationDelay: '3.1s' }}
        />
      </div>

      {/* Subtle Intercultural Border Filigree Lines (Top & Bottom) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </div>
  );
};
