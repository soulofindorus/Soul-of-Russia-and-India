import React, { useState } from 'react';
import { CulturalConnection, Language } from '../types';
import { culturalConnectionsData } from '../data/connectionsData';
import { translations } from '../i18n/translations';
import { Sparkles, ArrowRight, Flame, Droplets, Heart, Home, Film, CheckCircle2 } from 'lucide-react';

interface ConnectionsViewProps {
  currentLang: Language;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeConnectionId, setActiveConnectionId] = useState<string>(culturalConnectionsData[0].id);

  const activeConnection =
    culturalConnectionsData.find((c) => c.id === activeConnectionId) || culturalConnectionsData[0];

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bilateral Cultural Bridges</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-wide">
          {t.connections.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif-culture">
          {t.connections.subtitle}
        </p>
      </div>

      {/* Connection Selection Carousel / Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {culturalConnectionsData.map((conn) => {
          const isSelected = activeConnection.id === conn.id;
          const title =
            currentLang === 'ru' ? conn.titleRu : currentLang === 'hi' ? conn.titleHi : conn.title;

          return (
            <button
              key={conn.id}
              onClick={() => setActiveConnectionId(conn.id)}
              className={`rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 shadow-xl scale-105 ring-2 ring-amber-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850'
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>

      {/* Main Split-Screen Comparative Showcase */}
      <div className="space-y-8 rounded-3xl border border-amber-500/25 bg-[#091120] p-6 sm:p-10 shadow-2xl">
        {/* Split Screen Cards: Russia Left | India Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Russian Side */}
          <div className="space-y-6 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/30 to-[#0c1424] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/40 px-3 py-1 text-xs font-bold text-blue-300">
                <span>🇷🇺 РОССИЯ • RUSSIA</span>
              </span>
              <span className="text-xs text-slate-400 italic">{activeConnection.russianSide.subtitle}</span>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-700">
              <img
                src={activeConnection.russianSide.image}
                alt={activeConnection.russianSide.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {activeConnection.russianSide.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-serif-culture">
              {activeConnection.russianSide.description}
            </p>

            {/* Cultural Details */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Key Cultural Rituals & Symbols:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeConnection.russianSide.culturalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Indian Side */}
          <div className="space-y-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/30 to-[#0c1424] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300">
                <span>🇮🇳 भारत • INDIA</span>
              </span>
              <span className="text-xs text-slate-400 italic">{activeConnection.indianSide.subtitle}</span>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-700">
              <img
                src={activeConnection.indianSide.image}
                alt={activeConnection.indianSide.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {activeConnection.indianSide.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-serif-culture">
              {activeConnection.indianSide.description}
            </p>

            {/* Cultural Details */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Key Cultural Rituals & Symbols:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeConnection.indianSide.culturalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✦</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Synthesis: Shared Spirit & Historical Bridges */}
        <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-amber-300 font-cinzel text-base font-bold">
            <Heart className="h-5 w-5 text-amber-400" />
            <span>Philosophical Synthesis & Intercultural Dialogue</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.connections.sharedSpirit}
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeConnection.synthesis.sharedPhilosophy}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.connections.uniqueExpressions}
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeConnection.synthesis.differences}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.connections.historicalTies}
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeConnection.synthesis.historicalBridges}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
