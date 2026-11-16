import React, { useState } from 'react';
import { Globe, Sparkles, Volume2 } from 'lucide-react';
import { CULTURE_BRIDGE_LESSONS } from '../../data/school/labsAndCoursesData';
import { speakRussian } from '../../utils/russianSpeech';
import { SchoolThemeTokens } from './schoolTheme';

interface CultureBridgeViewProps {
  theme: SchoolThemeTokens;
}

export const CultureBridgeView: React.FC<CultureBridgeViewProps> = ({ theme }) => {
  const [selectedId, setSelectedId] = useState<string>(CULTURE_BRIDGE_LESSONS[0].id);
  const lesson =
    CULTURE_BRIDGE_LESSONS.find((c) => c.id === selectedId) || CULTURE_BRIDGE_LESSONS[0];

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Globe className={`h-4 w-4 ${theme.accentText}`} />
          <span className={theme.accentText}>Soul of Russia and India · Культурология</span>
        </div>
        <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
          Language Through Culture: 8 Indo-Russian Bridge Modules
        </h2>
        <p className={`text-xs sm:text-sm max-w-3xl ${theme.text}`}>
          Russian words carry centuries of hospitality, literature, seasons, and social etiquette.
          Explore each theme side by side with Indian cultural and linguistic equivalents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar list */}
        <div className="lg:col-span-4 space-y-2.5">
          {CULTURE_BRIDGE_LESSONS.map((c) => {
            const active = c.id === lesson.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full rounded-xl border p-4 text-left space-y-1 transition-colors cursor-pointer ${
                  active ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className={`text-[11px] font-bold uppercase ${active ? 'text-amber-300' : theme.accentText}`}>
                  {c.category}
                </div>
                <div className="font-cinzel text-sm font-bold leading-snug">{c.title}</div>
                <div className={`font-cyrillic text-xs ${active ? 'text-slate-200' : theme.muted}`}>
                  {c.titleRu}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Cultural Lesson */}
        <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 space-y-6 ${theme.cardBg}`}>
          <div className="border-b pb-4 border-inherit space-y-1">
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${theme.accentBgSoft}`}>
              {lesson.category}
            </span>
            <h3 className={`font-cinzel text-2xl font-bold pt-1 ${theme.heading}`}>{lesson.title}</h3>
            <p className={`font-cyrillic text-sm ${theme.muted}`}>{lesson.titleRu}</p>
            <p className={`text-sm pt-1 leading-relaxed ${theme.text}`}>{lesson.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Russian Cultural Context
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
                {lesson.russianContext}
              </p>
            </div>

            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Indian Cultural & Linguistic Parallel
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
                {lesson.indianEquivalent}
              </p>
            </div>
          </div>

          <div className={`rounded-xl border p-4 space-y-1 text-xs sm:text-sm ${theme.accentBgSoft}`}>
            <div className="font-bold uppercase tracking-wider text-[11px]">
              Crucial Nuance to Remember
            </div>
            <p className="leading-relaxed">{lesson.keyDifferences}</p>
          </div>

          {/* Expressions */}
          <div className="space-y-3">
            <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
              Authentic Cultural Expressions
            </h4>
            <div className="space-y-2.5">
              {lesson.keyExpressions.map((exp, idx) => (
                <div key={idx} className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${theme.subCardBg}`}>
                  <div className="space-y-1">
                    <div className={`font-cyrillic text-base font-bold ${theme.heading}`}>
                      {exp.stressed}
                    </div>
                    <div className={`text-xs sm:text-sm ${theme.text}`}>{exp.english}</div>
                    <div className={`font-devanagari text-xs ${theme.muted}`}>
                      {exp.hindiComparison}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakRussian(exp.russian)}
                    className={`rounded-lg border p-2 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Proverb Parallel */}
          {lesson.proverb && (
            <div className={`rounded-xl border p-5 space-y-2 ${theme.subCardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Russian Proverb & Indian Wisdom Parallel</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className={`font-cyrillic text-lg font-bold ${theme.heading}`}>
                  «{lesson.proverb.russian}»
                </div>
                <button
                  type="button"
                  onClick={() => speakRussian(lesson.proverb!.russian)}
                  className={`rounded-lg border p-1.5 cursor-pointer ${theme.secondaryBtn}`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className={`text-xs italic ${theme.muted}`}>Literal: “{lesson.proverb.literal}”</p>
              <p className={`text-xs sm:text-sm ${theme.text}`}>{lesson.proverb.meaning}</p>
              <p className={`font-devanagari text-xs font-semibold ${theme.accentText}`}>
                Hindi Parallel: {lesson.proverb.indianParallel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
