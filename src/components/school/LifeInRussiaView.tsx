import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Plane,
  Volume2,
} from 'lucide-react';
import { LIFE_IN_RUSSIA_MODULES } from '../../data/school/labsAndCoursesData';
import { speakRussian } from '../../utils/russianSpeech';
import { SchoolThemeTokens } from './schoolTheme';

interface LifeInRussiaViewProps {
  theme: SchoolThemeTokens;
}

export const LifeInRussiaView: React.FC<LifeInRussiaViewProps> = ({ theme }) => {
  const [catFilter, setCatFilter] = useState<string>('All');
  const [selectedId, setSelectedId] = useState<string>(LIFE_IN_RUSSIA_MODULES[0].id);

  const categories = ['All', 'Arrival', 'University', 'Transit', 'Daily Life', 'Culture & Etiquette'];
  const filtered = LIFE_IN_RUSSIA_MODULES.filter(
    (m) => catFilter === 'All' || m.category === catFilter
  );
  const active =
    LIFE_IN_RUSSIA_MODULES.find((m) => m.id === selectedId) || filtered[0] || LIFE_IN_RUSSIA_MODULES[0];

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Practical Survival & University Track
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Russian for Life and Study in Russia (8 Modules)
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-3xl ${theme.text}`}>
              Field-tested Russian dialogues, phrase cards, vegetarian café phrasing, migration
              registration steps, and everyday etiquette for students arriving in Russian cities.
            </p>
          </div>
          <Plane className={`h-8 w-8 shrink-0 hidden sm:block ${theme.accentText}`} />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                catFilter === cat ? theme.primaryBtn : theme.secondaryBtn
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar list */}
        <div className="lg:col-span-4 space-y-2.5">
          {filtered.map((mod) => {
            const sel = mod.id === active.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedId(mod.id)}
                className={`w-full rounded-xl border p-4 text-left space-y-1 transition-colors cursor-pointer ${
                  sel ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className={`text-[11px] font-bold uppercase ${sel ? 'text-amber-300' : theme.accentText}`}>
                  Module {mod.order} · {mod.category}
                </div>
                <div className="font-cinzel text-sm font-bold leading-snug">{mod.title}</div>
                <div className={`font-cyrillic text-xs ${sel ? 'text-slate-200' : theme.muted}`}>
                  {mod.titleRu}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Practical Module */}
        <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 space-y-6 ${theme.cardBg}`}>
          <div className="border-b pb-4 border-inherit space-y-1">
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${theme.accentBgSoft}`}>
              {active.category}
            </span>
            <h3 className={`font-cinzel text-2xl font-bold pt-1 ${theme.heading}`}>{active.title}</h3>
            <p className={`font-cyrillic text-sm ${theme.muted}`}>{active.titleRu}</p>
            <p className={`text-sm pt-1 leading-relaxed ${theme.text}`}>{active.summary}</p>
          </div>

          {/* Essential Phrase Cards */}
          <div className="space-y-3">
            <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
              Essential Situation Phrases
            </h4>
            <div className="space-y-2.5">
              {active.phrases.map((ph, idx) => (
                <div key={idx} className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${theme.subCardBg}`}>
                  <div className="space-y-1">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                      {ph.context}
                    </div>
                    <div className={`font-cyrillic text-base font-bold ${theme.heading}`}>
                      {ph.stressed}
                    </div>
                    <div className={`text-xs font-mono ${theme.muted}`}>{ph.translit}</div>
                    <div className={`text-xs sm:text-sm ${theme.text}`}>{ph.english}</div>
                    <div className={`font-devanagari text-xs ${theme.muted}`}>{ph.hindi}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakRussian(ph.russian)}
                    className={`rounded-lg border p-2 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                    aria-label="Play Russian phrase"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Situational Dialogue */}
          <div className={`rounded-xl border p-5 space-y-3 ${theme.subCardBg}`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
                  Dialogue: {active.dialogue.title}
                </h4>
                <div className={`text-xs ${theme.muted}`}>{active.dialogue.location}</div>
              </div>
              <button
                type="button"
                onClick={() => speakRussian(active.dialogue.lines.map((l) => l.russian).join('. '))}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Play Dialogue</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {active.dialogue.lines.map((ln, idx) => (
                <div key={idx} className={`rounded-lg border p-3.5 flex items-start justify-between gap-3 ${theme.cardBg}`}>
                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-bold uppercase ${theme.accentText}`}>
                      {ln.speaker}
                    </span>
                    <div className={`font-cyrillic text-sm font-bold ${theme.heading}`}>{ln.stressed}</div>
                    <div className={`text-xs ${theme.text}`}>{ln.english}</div>
                    <div className={`font-devanagari text-[11px] ${theme.muted}`}>{ln.hindi}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakRussian(ln.russian)}
                    className={`rounded border p-1.5 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Etiquette Checklist & Misunderstanding Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Student Checklist & Local Tips
              </div>
              <ul className="space-y-2 text-xs">
                {active.etiquetteAndTips.map((tip, i) => (
                  <li key={i} className={`flex items-start gap-2 ${theme.text}`}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-xl border p-4 space-y-1.5 text-xs ${theme.accentBgSoft}`}>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>Common Misunderstanding</span>
              </div>
              <div className="font-bold pt-1">{active.commonMisunderstanding.situation}</div>
              <p>{active.commonMisunderstanding.whatHappens}</p>
              <p className="font-semibold pt-1">
                Tip: {active.commonMisunderstanding.howToNavigate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
