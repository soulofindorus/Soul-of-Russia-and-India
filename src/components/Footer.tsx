import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { subscribeNewsletter } from '../lib/supabase';
import { Compass, Sparkles, Send, Youtube, Instagram, Heart, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (section: string) => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onLanguageChange,
  onNavigate,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const t = translations[currentLang];
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim() || !newsEmail.includes('@')) return;

    setSubmitting(true);
    await subscribeNewsletter(newsEmail.trim());
    setSubmitting(false);
    setSubscribed(true);
    setNewsEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="relative border-t border-amber-500/20 bg-[#070b13] text-slate-300 w-full overflow-x-hidden">
      {/* Decorative top border gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-700 via-amber-400 to-orange-600" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
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
                  onClick={() => onNavigate('victory')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.victory || 'Память победы'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('articles')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.articles || 'Articles & Blogs'}
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

        {/* Newsletter Subscription Row */}
        <div className="mt-12 rounded-2xl border border-amber-500/20 bg-slate-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-cinzel text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4 text-amber-400" />
              <span>Stay Connected to the Cultural Bridge</span>
            </h4>
            <p className="text-xs text-slate-400">
              Receive updates on academic opportunities, research expeditions, and literature publications directly.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 px-4 py-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Subscribed to updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2">
              <input
                type="email"
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full sm:w-72 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shrink-0 disabled:opacity-50 cursor-pointer text-center"
              >
                {submitting ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Bottom copyright & Admin Access */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500 gap-3">
          <p>© 2026 Soul of Russia and India. {t.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <p className="flex items-center gap-1.5 text-slate-400">
              <span>Built with respect for human culture</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>by Sarika Kumari & Ritik Kumar Singh</span>
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border transition-all cursor-pointer text-[11px] ${
                  isAdmin
                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-semibold'
                    : 'border-slate-800 hover:border-amber-500/30 bg-slate-900/60 text-slate-500 hover:text-amber-400'
                }`}
                title="Administrator Management Portal"
              >
                <ShieldCheck className={`h-3.5 w-3.5 ${isAdmin ? 'text-emerald-400' : 'text-amber-500/60'}`} />
                <span>{isAdmin ? 'Admin Mode Active' : 'Admin Portal'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
