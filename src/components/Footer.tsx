import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Compass, Sparkles, Send, Youtube, Instagram, Heart } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const t = translations[currentLang];

  return (
    <footer className="relative border-t border-amber-500/20 bg-[#070b13] text-slate-300">
      {/* Decorative top border gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-700 via-amber-400 to-orange-600" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/emblem.jpg"
                alt="Emblem"
                className="h-12 w-12 rounded-full border-2 border-amber-400/50 object-cover shadow-lg"
              />
              <div>
                <span className="font-cinzel text-xl font-bold tracking-wide text-amber-200">
                  SOUL OF RUSSIA AND INDIA
                </span>
                <div className="text-xs text-amber-400/80 font-serif-culture">
                  Душа России и Индии • <span className="font-devanagari">भारत और रूस की आत्मा</span>
                </div>
              </div>
            </div>
            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              “{t.footer.tagline}”
            </p>
            <p className="max-w-md text-xs text-slate-500 leading-relaxed">
              An independent cultural-education initiative promoting Russian and Indian language, literature, archaeology, youth fellowships, and deep civilizational dialogue.
            </p>

            {/* Social media links */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-3">
                {t.footer.social}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/Sarikajnu34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-blue-400 hover:text-blue-400 hover:scale-110 hover:shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                  title="Telegram (@Sarikajnu34)"
                >
                  <Send className="h-4 w-4" />
                </a>
                <a
                  href="https://vk.ru/sarikajnu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-indigo-400 hover:text-indigo-400 hover:scale-110 hover:shadow-[0_0_12px_rgba(129,140,248,0.4)] text-xs font-bold font-serif"
                  title="VKontakte (@sarikajnu)"
                >
                  VK
                </a>
                <a
                  href="https://youtube.com/@misssarika3046?si=amd-XRr97iJ2HT4H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-red-500 hover:text-red-400 hover:scale-110 hover:shadow-[0_0_12px_rgba(248,113,113,0.4)]"
                  title="YouTube (@misssarika3046)"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/not.sarika_?stkn=ZWdubW9tY292Yml5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-pink-400 hover:text-pink-400 hover:scale-110 hover:shadow-[0_0_12px_rgba(244,114,182,0.4)]"
                  title="Instagram (@not.sarika_)"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-semibold uppercase tracking-wider text-amber-300">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('heritage')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.heritage}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('language')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.language}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.opportunities}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('connections')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.connections}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Languages & Principles */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-semibold uppercase tracking-wider text-amber-300">
              {t.footer.languages}
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onLanguageChange('en')}
                className={`text-left text-sm transition-colors ${
                  currentLang === 'en' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English (International)
              </button>
              <button
                onClick={() => onLanguageChange('ru')}
                className={`text-left text-sm transition-colors ${
                  currentLang === 'ru' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Русский язык (Россия)
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`text-left text-sm transition-colors ${
                  currentLang === 'hi' ? 'text-orange-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी (भारत)
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-amber-500/15 bg-slate-900/60 p-3 text-xs text-amber-200/80">
              <span className="font-semibold text-amber-400 block mb-1">Civilizational Dialogue</span>
              Dedicated to youth opportunities, Russian and Indian literature, archaeology, and intercultural understanding.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© 2026 Soul of Russia and India. {t.footer.rights}</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1.5 text-slate-400">
            <span>Built with respect for human culture</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>by Sarika Kumari & Ritik Kumar Singh</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
