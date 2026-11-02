import React, { useState, useEffect } from 'react';
import { X, Play, ExternalLink, Film, Globe, Tag, Sparkles, PenTool, CheckCircle2, Save } from 'lucide-react';
import { VideoItem, SoulStoryEpisode, Language } from '../types';
import { translations } from '../i18n/translations';

interface VideoPlayerModalProps {
  video: (VideoItem | SoulStoryEpisode) | null;
  currentLang: Language;
  onClose: () => void;
  isAdmin?: boolean;
  onUpdateVideo?: (
    videoId: string,
    updates: {
      videoUrl: string;
      title?: string;
      titleRu?: string;
      titleHi?: string;
      thumbnail?: string;
      shortDescription?: string;
    }
  ) => void;
}

export function formatVideoEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/watch?v=')) {
    const videoId = trimmed.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  } else if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  } else if (trimmed.includes('youtube.com/shorts/')) {
    const videoId = trimmed.split('shorts/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  return trimmed;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  currentLang,
  onClose,
  isAdmin = false,
  onUpdateVideo,
}) => {
  if (!video) return null;

  const t = translations[currentLang];
  const [activeUrl, setActiveUrl] = useState(video.videoUrl);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editUrl, setEditUrl] = useState(video.videoUrl);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editTitleRu, setEditTitleRu] = useState(video.titleRu);
  const [editThumb, setEditThumb] = useState(video.thumbnail);
  const [editDesc, setEditDesc] = useState(
    'shortDescription' in video
      ? (video as VideoItem).shortDescription
      : (video as SoulStoryEpisode).description
  );
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    setActiveUrl(video.videoUrl);
    setEditUrl(video.videoUrl);
    setEditTitle(video.title);
    setEditTitleRu(video.titleRu);
    setEditThumb(video.thumbnail);
    setEditDesc(
      'shortDescription' in video
        ? (video as VideoItem).shortDescription
        : (video as SoulStoryEpisode).description
    );
    setSaveSuccessMsg('');
  }, [video]);

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUrl.trim()) {
      const formatted = formatVideoEmbedUrl(editUrl);
      setActiveUrl(formatted);
    }
  };

  const handleSaveToSite = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatVideoEmbedUrl(editUrl);
    setActiveUrl(formatted);

    if (onUpdateVideo) {
      onUpdateVideo(video.id, {
        videoUrl: formatted,
        title: editTitle.trim(),
        titleRu: editTitleRu.trim(),
        thumbnail: editThumb.trim(),
        shortDescription: editDesc.trim(),
      });
      setSaveSuccessMsg('Video successfully updated on website!');
      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 2500);
    }
  };

  const isEpisode = 'episodeNumber' in video;
  const isVideoItem = 'category' in video;

  const displayTitle =
    currentLang === 'ru' ? video.titleRu : currentLang === 'hi' ? video.titleHi : video.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1322] shadow-2xl scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#080d18] px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Film className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                {isEpisode
                  ? `Soul Stories • Episode ${(video as SoulStoryEpisode).episodeNumber}`
                  : (video as VideoItem).category}
              </span>
              <h3 className="font-cinzel text-base sm:text-xl font-bold text-slate-100 line-clamp-1">
                {displayTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isEditing
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                }`}
                title="Admin: Change this video"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Close Editor' : 'Admin: Change Video'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          {activeUrl ? (
            <iframe
              src={activeUrl}
              title={displayTitle}
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

        {/* Admin Edit Video Form Drawer (When Opened) */}
        {isAdmin && isEditing && (
          <div className="border-y border-amber-500/40 bg-gradient-to-b from-[#131d33] to-[#0c1322] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <PenTool className="h-4 w-4" />
                <span>Administrator Video Replacement Panel</span>
              </div>
              {saveSuccessMsg && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-pulse">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{saveSuccessMsg}</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveToSite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Video URL (YouTube link / embed / MP4) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or embed URL"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    Test Preview
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  You can paste any standard YouTube link (e.g. youtube.com/watch?v=... or youtu.be/...) — it will be auto-formatted into a player embed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Video Title (English)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Video Title (Russian)
                  </label>
                  <input
                    type="text"
                    value={editTitleRu}
                    onChange={(e) => setEditTitleRu(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Thumbnail Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editThumb}
                  onChange={(e) => setEditThumb(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-amber-400 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes to Website (Admin)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Details Section */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {'region' in video
                  ? (video as VideoItem).region
                  : (video as SoulStoryEpisode).location}
              </span>
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

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-serif-culture">
            {'description' in video
              ? video.description
              : (video as VideoItem).shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
