import React, { useState } from 'react';
import { ExternalLink, PlaySquare, CheckCircle, XCircle, X, BookOpen } from 'lucide-react';
import { VideoReference } from '../../types/school';
import { SchoolThemeTokens } from './schoolTheme';

interface VideoLessonModalProps {
  video: VideoReference | null;
  theme: SchoolThemeTokens;
  onClose: () => void;
}

export const VideoLessonModal: React.FC<VideoLessonModalProps> = ({ video, theme, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  if (!video) return null;

  const hasVerifiedEmbed = Boolean(video.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId));
  const cq = video.comprehensionQuestion;
  const isCorrect = cq ? selectedOption === cq.correctAnswer : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl ${theme.cardBg}`}
      >
        <button
          onClick={onClose}
          aria-label="Close video reference modal"
          className={`absolute right-4 top-4 rounded-lg border p-2 transition-colors cursor-pointer ${theme.secondaryBtn}`}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-4 pr-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 ${theme.accentBgSoft}`}>
              <PlaySquare className="h-3.5 w-3.5" />
              Video Lesson Reference · Видеоурок
            </span>
            <span className={theme.muted}>{video.channelName}</span>
          </div>

          <div>
            <h3 id="video-modal-title" className={`font-cinzel text-xl sm:text-2xl font-bold ${theme.heading}`}>
              {video.title}
            </h3>
            <p className={`font-cyrillic text-sm mt-1 ${theme.muted}`}>{video.titleRu}</p>
          </div>
        </div>

        {/* Video Embed (only when faculty supplied a verified 11-char YouTube ID) OR Safe YouTube Topic Link */}
        <div className="mt-5">
          {hasVerifiedEmbed ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className={`rounded-xl border p-6 text-center space-y-4 ${theme.subCardBg}`}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-600">
                <PlaySquare className="h-6 w-6" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <h4 className={`font-semibold text-base ${theme.heading}`}>
                  Curated Native Russian Video Search
                </h4>
                <p className={`text-sm leading-relaxed ${theme.text}`}>
                  {video.description}
                </p>
                <p className={`text-xs ${theme.muted}`}>
                  Channel guide: <strong>{video.channelName}</strong>. Opens a verified YouTube search query in a new tab (teachers can also attach direct video links in the Faculty Panel).
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={video.url || video.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${theme.primaryBtn}`}
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Study Notes */}
        <div className={`mt-5 rounded-xl border p-4 space-y-1.5 ${theme.subCardBg}`}>
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
            <BookOpen className="h-3.5 w-3.5" />
            <span>Teacher Guidance & Listening Focus</span>
          </div>
          <p className={`text-sm leading-relaxed ${theme.text}`}>{video.teacherNotes}</p>
        </div>

        {/* Comprehension Question */}
        {cq && (
          <div className={`mt-5 rounded-xl border p-5 space-y-3 ${theme.subCardBg}`}>
            <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
              Quick Video Check
            </div>
            <p className={`text-sm font-semibold ${theme.heading}`}>{cq.question}</p>
            <div className="space-y-2">
              {cq.options.map((opt) => {
                const chosen = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={checked}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      checked
                        ? opt === cq.correctAnswer
                          ? 'border-emerald-500 bg-emerald-500/15 font-semibold text-emerald-700'
                          : chosen
                          ? 'border-red-500 bg-red-500/15 text-red-700'
                          : `${theme.border} opacity-60`
                        : chosen
                        ? `${theme.accentBgSoft} font-semibold`
                        : `${theme.cardBg} hover:border-slate-400`
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {!checked ? (
              <button
                type="button"
                disabled={!selectedOption}
                onClick={() => setChecked(true)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 ${theme.primaryBtn}`}
              >
                Check Understanding
              </button>
            ) : (
              <div className={`rounded-lg border p-3 text-xs space-y-1 ${isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-amber-500/40 bg-amber-500/10'}`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {isCorrect ? (
                    <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Correct</span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1"><XCircle className="h-4 w-4" /> Review Explanation</span>
                  )}
                </div>
                <p className={theme.text}>{cq.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
