import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Volume2,
  XCircle,
} from 'lucide-react';
import { GRAMMAR_LAB_GUIDES } from '../../data/school/labsAndCoursesData';
import { speakRussian } from '../../utils/russianSpeech';
import { SchoolThemeTokens } from './schoolTheme';

interface GrammarLabViewProps {
  theme: SchoolThemeTokens;
}

export const GrammarLabView: React.FC<GrammarLabViewProps> = ({ theme }) => {
  const [selectedId, setSelectedId] = useState<string>(GRAMMAR_LAB_GUIDES[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const guide =
    GRAMMAR_LAB_GUIDES.find((g) => g.id === selectedId) || GRAMMAR_LAB_GUIDES[0];

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
        <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
          Analytical Reference & Drills · Грамматика
        </span>
        <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
          Russian Grammar Reference & Comparison Lab
        </h2>
        <p className={`text-xs sm:text-sm max-w-3xl ${theme.text}`}>
          Visual declension and conjugation tables paired with side-by-side grammatical contrasts
          and dedicated troubleshooting guides addressing common mistakes made by Indian learners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Topic Navigator */}
        <div className="lg:col-span-4 space-y-2.5">
          {GRAMMAR_LAB_GUIDES.map((g) => {
            const active = g.id === guide.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setSelectedId(g.id);
                  setAnswers({});
                  setSubmitted({});
                }}
                className={`w-full rounded-xl border p-4 text-left space-y-1 transition-colors cursor-pointer ${
                  active ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className={`text-[11px] font-bold uppercase ${active ? 'text-amber-300' : theme.accentText}`}>
                  Level {g.levelId.toUpperCase()}
                </div>
                <div className="font-cinzel text-sm font-bold leading-snug">{g.title}</div>
                <div className={`font-cyrillic text-xs ${active ? 'text-slate-200' : theme.muted}`}>
                  {g.titleRu}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Grammar Guide */}
        <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 space-y-7 ${theme.cardBg}`}>
          <div className="border-b pb-4 border-inherit space-y-1">
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${theme.accentBgSoft}`}>
              {guide.levelId.toUpperCase()}
            </span>
            <h3 className={`font-cinzel text-2xl font-bold pt-1 ${theme.heading}`}>{guide.title}</h3>
            <p className={`font-cyrillic text-sm ${theme.muted}`}>{guide.titleRu}</p>
            <p className={`text-sm pt-1 leading-relaxed ${theme.text}`}>{guide.summary}</p>
          </div>

          {/* Step-by-step concepts */}
          <div className="space-y-4">
            {guide.steps.map((step) => (
              <div key={step.heading} className={`rounded-xl border p-5 space-y-3 ${theme.subCardBg}`}>
                <h4 className={`text-sm sm:text-base font-bold ${theme.heading}`}>{step.heading}</h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>{step.explanation}</p>
                <div className="space-y-2">
                  {step.examples.map((ex, i) => (
                    <div key={i} className={`rounded-lg border p-3 flex items-center justify-between gap-3 ${theme.cardBg}`}>
                      <div className="space-y-0.5 text-xs">
                        <div className={`font-cyrillic text-sm font-bold ${theme.heading}`}>{ex.ru}</div>
                        <div className={`font-mono ${theme.muted}`}>{ex.translit}</div>
                        <div className={theme.text}>{ex.en}</div>
                        {ex.hi && <div className={`font-devanagari ${theme.muted}`}>{ex.hi}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => speakRussian(ex.ru.replace(/\(.*?\)/g, ''))}
                        className={`rounded-lg border p-2 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reference Tables */}
          {guide.tables.map((tbl) => (
            <div key={tbl.title} className="space-y-2">
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <BookOpen className="h-3.5 w-3.5" />
                <span>{tbl.title}</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-inherit">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className={theme.tableHeader}>
                      {tbl.headers.map((h) => (
                        <th key={h} className="p-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.rows.map((r, rIdx) => (
                      <tr key={rIdx} className={`border-t ${theme.tableRow}`}>
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} className={`p-2.5 font-cyrillic ${cIdx === 0 ? 'font-semibold' : ''}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Side-by-Side Comparisons */}
          {guide.comparisons.map((cmp) => (
            <div key={cmp.title} className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Contrast: {cmp.title}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`rounded-lg border p-3 font-cyrillic font-semibold ${theme.cardBg}`}>
                  {cmp.formA}
                </div>
                <div className={`rounded-lg border p-3 font-cyrillic font-semibold ${theme.cardBg}`}>
                  {cmp.formB}
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${theme.text}`}>{cmp.explanation}</p>
            </div>
          ))}

          {/* Common Mistakes Made by Indian Learners */}
          <div className="space-y-3">
            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
              <AlertTriangle className="h-4 w-4" />
              <span>Common Mistakes Made by Indian Learners</span>
            </div>
            <div className="space-y-2.5">
              {guide.indianLearnerMistakes.map((m, idx) => (
                <div key={idx} className={`rounded-xl border p-4 space-y-1 text-xs ${theme.accentBgSoft}`}>
                  <div className="font-bold">Avoid: {m.mistake}</div>
                  <div>Why: {m.whyItHappens}</div>
                  <div className="font-semibold">Fix: {m.correction}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Drills */}
          <div className="space-y-3 pt-2 border-t border-inherit">
            <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
              Topic Practice Check
            </h4>
            {guide.exercises.map((ex, idx) => {
              const chosen = answers[ex.id] || '';
              const done = Boolean(submitted[ex.id]);
              const ok = chosen === ex.correctAnswer;
              return (
                <div key={ex.id} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                  <p className={`text-sm font-bold ${theme.heading}`}>
                    {idx + 1}. {ex.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(ex.options || []).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={done}
                        onClick={() => setAnswers((p) => ({ ...p, [ex.id]: opt }))}
                        className={`rounded-lg border px-3.5 py-2 text-left text-xs sm:text-sm cursor-pointer ${
                          done
                            ? opt === ex.correctAnswer
                              ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700'
                              : chosen === opt
                              ? 'border-red-500 bg-red-500/15 text-red-700'
                              : theme.cardBg
                            : chosen === opt
                            ? `${theme.accentBgSoft} font-bold`
                            : theme.cardBg
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {!done ? (
                    <button
                      type="button"
                      disabled={!chosen}
                      onClick={() => setSubmitted((p) => ({ ...p, [ex.id]: true }))}
                      className={`rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40 ${theme.primaryBtn}`}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="flex items-start gap-2 text-xs">
                      {ok ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                      )}
                      <span className={theme.text}>{ex.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
