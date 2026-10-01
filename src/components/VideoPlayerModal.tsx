import React, { useState } from 'react';
import { X, Play, ExternalLink, Film, Globe, Tag, Sparkles } from 'lucide-react';
import { VideoItem, SoulStoryEpisode, Language } from '../types';
import { translations } from '../i18n/translations';

interface VideoPlayerModalProps {
  video: (VideoItem | SoulStoryEpisode) | null;
  currentLang: Language;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, currentLang, onClose }) => {
  if (!video) return null;

  const t = translations[currentLang];
  const [customUrl, setCustomUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState(video.videoUrl);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      let finalUrl = customUrl.trim();
      // Auto convert standard YouTube watch URL to embed URL if needed
      if (finalUrl.includes('youtube.com/watch?v=')) {
        const videoId = finalUrl.split('v=')[1]?.split('&')[0];
        if (videoId) finalUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (finalUrl.includes('youtu.be/')) {
        const videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) finalUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      setActiveUrl(finalUrl);
    }
  };

  const isEpisode = 'episodeNumber' in video;
  const isVideoItem = 'category' in video;

  const title =
    currentLang === 'ru' ? video.titleRu : currentLang === 'hi' ? video.titleHi : video.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0c1322] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#080d18] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Film className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                {isEpisode ? `Soul Stories • Episode ${(video as SoulStoryEpisode).episodeNumber}` : (video as VideoItem).category}
              </span>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 sm:text-xl line-clamp-1">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          {activeUrl ? (
            <iframe
              src={activeUrl}
              title={title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
              <Play className="h-12 w-12 text-amber-400 opacity-60" />
              <p>Video stream placeholder ready</p>
            </div>
          )}
        </div>

        {/* Details & Custom URL Bar */}
        <div className="max-h-60 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>{'region' in video ? (video as VideoItem).region : (video as SoulStoryEpisode).location}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-medium">{video.country}</span>
              {'duration' in video && video.duration && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>{video.duration}</span>
                </>
              )}
            </div>

            {/* Themes / Tags */}
            <div className="flex flex-wrap gap-1.5">
              {isEpisode &&
                (video as SoulStoryEpisode).keyThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300 border border-slate-700"
                  >
                    #{theme}
                  </span>
                ))}
              {isVideoItem && (
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300 border border-amber-500/20">
                  {(video as VideoItem).category}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            {'description' in video ? video.description : (video as VideoItem).shortDescription}
          </p>

          {/* Connect Your Own Video Bar */}
          <div className="rounded-xl border border-amber-500/20 bg-slate-900/80 p-3">
            <form onSubmit={handleApplyCustomUrl} className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-xs text-amber-300/90 whitespace-nowrap flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Replace with your video / YouTube URL:</span>
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors whitespace-nowrap"
              >
                Load Video
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
