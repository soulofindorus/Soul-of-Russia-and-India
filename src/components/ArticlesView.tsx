import React, { useState, useEffect } from 'react';
import { ArticleItem, Language } from '../types';
import { initialArticlesData } from '../data/articlesData';
import { translations } from '../i18n/translations';
import {
  BookOpen,
  Newspaper,
  PenTool,
  Clock,
  Calendar,
  User,
  Search,
  Tag,
  Share2,
  Check,
  X,
  PlusCircle,
  Trash2,
  ChevronRight,
  Sparkles,
  Play,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Edit3,
  Upload,
} from 'lucide-react';
import { readFileAsDataUrl } from '../utils/imageUpload';

interface ArticlesViewProps {
  currentLang: Language;
  isAdmin?: boolean;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ currentLang, isAdmin = false }) => {
  const t = translations[currentLang];

  // Articles state with localStorage persistence
  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    const saved = localStorage.getItem('sri_custom_articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved articles', e);
      }
    }
    return initialArticlesData;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copiedDirectLink, setCopiedDirectLink] = useState<boolean>(false);

  const handleCopyDirectLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#articles`;
      await navigator.clipboard.writeText(url);
      setCopiedDirectLink(true);
      setTimeout(() => setCopiedDirectLink(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  // Admin Write Article Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleRu, setNewTitleRu] = useState('');
  const [newHeading, setNewHeading] = useState('');
  const [newCategory, setNewCategory] = useState('Cultural Diplomacy');
  const [newAuthor, setNewAuthor] = useState('Administrator');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newReadTime, setNewReadTime] = useState('5 min read');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newExcerptRu, setNewExcerptRu] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newContentRu, setNewContentRu] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newTags, setNewTags] = useState('Culture, Russia, India');

  const categories = [
    'All',
    'Cultural Diplomacy',
    'Archaeology & History',
    'Literature & Philosophy',
    'Heroism & Memory',
  ];

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExcerpt.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created: ArticleItem = {
      id: `art-custom-${Date.now()}`,
      title: newTitle.trim(),
      titleRu: newTitleRu.trim() || newTitle.trim(),
      heading: newHeading.trim() || newTitle.trim(),
      category: newCategory,
      author: newAuthor.trim() || 'Administrator',
      date: newDate.trim() || new Date().toISOString().split('T')[0],
      readTime: newReadTime.trim() || '5 min read',
      excerpt: newExcerpt.trim(),
      excerptRu: newExcerptRu.trim() || newExcerpt.trim(),
      content: newContent.trim(),
      contentRu: newContentRu.trim() || newContent.trim(),
      image:
        newImage.trim() ||
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      videoUrl: newVideoUrl.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Culture', 'Bilateral'],
      isFeatured: false,
    };

    setArticles((prev) => {
      const updated = [created, ...prev];
      try {
        localStorage.setItem('sri_custom_articles', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewTitleRu('');
    setNewHeading('');
    setNewExcerpt('');
    setNewExcerptRu('');
    setNewContent('');
    setNewContentRu('');
    setNewImage('');
    setNewVideoUrl('');
    setNewTags('Culture, Russia, India');
  };

  // Admin Edit Article Modal State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleRu, setEditTitleRu] = useState('');
  const [editHeading, setEditHeading] = useState('');
  const [editCategory, setEditCategory] = useState('Cultural Diplomacy');
  const [editAuthor, setEditAuthor] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editReadTime, setEditReadTime] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editExcerptRu, setEditExcerptRu] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editContentRu, setEditContentRu] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editTags, setEditTags] = useState('');

  const handleStartEditArticle = (article: ArticleItem) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditTitleRu(article.titleRu || article.title);
    setEditHeading(article.heading || article.title);
    setEditCategory(article.category);
    setEditAuthor(article.author);
    setEditDate(article.date);
    setEditReadTime(article.readTime);
    setEditExcerpt(article.excerpt);
    setEditExcerptRu(article.excerptRu || article.excerpt);
    setEditContent(article.content);
    setEditContentRu(article.contentRu || article.content);
    setEditImage(article.image);
    setEditVideoUrl(article.videoUrl || '');
    setEditTags(article.tags ? article.tags.join(', ') : '');
  };

  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editTitle.trim() || !editExcerpt.trim() || !editContent.trim()) return;

    const parsedTags = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedArticle: ArticleItem = {
      ...editingArticle,
      title: editTitle.trim(),
      titleRu: editTitleRu.trim() || editTitle.trim(),
      heading: editHeading.trim() || editTitle.trim(),
      category: editCategory,
      author: editAuthor.trim() || 'Administrator',
      date: editDate.trim() || editingArticle.date,
      readTime: editReadTime.trim() || '5 min read',
      excerpt: editExcerpt.trim(),
      excerptRu: editExcerptRu.trim() || editExcerpt.trim(),
      content: editContent.trim(),
      contentRu: editContentRu.trim() || editContent.trim(),
      image: editImage.trim() || editingArticle.image,
      videoUrl: editVideoUrl.trim(),
      tags: parsedTags.length > 0 ? parsedTags : editingArticle.tags,
    };

    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
      try {
        localStorage.setItem('sri_custom_articles', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    if (activeArticle?.id === updatedArticle.id) {
      setActiveArticle(updatedArticle);
    }

    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        try {
          localStorage.setItem('sri_custom_articles', JSON.stringify(updated));
        } catch (err) {}
        return updated;
      });
      if (activeArticle?.id === id) {
        setActiveArticle(null);
      }
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      article.title.toLowerCase().includes(q) ||
      (article.titleRu && article.titleRu.toLowerCase().includes(q)) ||
      (article.heading && article.heading.toLowerCase().includes(q)) ||
      article.author.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];

  return (
    <section className="min-h-screen py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full flex flex-col items-center animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-4 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase shadow-sm">
          <Newspaper className="h-4 w-4 text-amber-600" />
          <span>Articles • Blogs • Intellectual Dialogue</span>
        </div>

        <h1 className="font-cinzel text-3xl xs:text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-wide break-words drop-shadow-sm">
          {currentLang === 'ru'
            ? 'СТАТЬИ И БЛОГИ'
            : currentLang === 'hi'
            ? 'लेख और ब्लॉग (ARTICLES & BLOGS)'
            : 'ARTICLES & BLOGS'}
        </h1>

        <p className="text-sm sm:text-lg text-slate-700 leading-relaxed font-serif-culture max-w-3xl mx-auto">
          {currentLang === 'ru'
            ? 'Исследования, культурологические эссе, исторические открытия и аналитические заметки о вековых связях России и Индии.'
            : currentLang === 'hi'
            ? 'रूस और भारत के सांस्कृतिक सेतु, पुरातत्व, साहित्य, इतिहास और समसामयिक युवा विचारों पर आधारित विशेष लेख व ब्लॉग।'
            : 'Scholarly essays, cultural reflections, archaeological breakthroughs, and intellectual commentaries exploring the deep parallels and living dialogue between Russia and India.'}
        </p>

        {/* Action Bar (Admin Write & Direct Link) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg hover:from-amber-500 hover:to-amber-400 hover:scale-105 transition-all cursor-pointer"
            >
              <PenTool className="h-4 w-4" />
              <span>+ Write New Article (Admin)</span>
            </button>
          )}

          <button
            onClick={handleCopyDirectLink}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all border ${
              copiedDirectLink
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500 hover:text-amber-800'
            }`}
            title="Copy Direct Link to Scholarly Articles & Blogs"
          >
            {copiedDirectLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span className="font-bold">Copied Direct Link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-amber-600" />
                <span>Share: articles.*</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="w-full space-y-4">
        <div className="relative max-w-xl mx-auto w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ru'
                ? 'Поиск статей по теме, автору, тегам (Толстой, Наланда, Никитин...)'
                : 'Search articles by title, author, keyword, or tag (Tolstoy, Nalanda, Nikitin...)'
            }
            className="w-full rounded-2xl border border-slate-300 bg-white/90 pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin max-w-full justify-start sm:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? articles.length
                : articles.filter((a) => a.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-md scale-105'
                    : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-amber-800 text-amber-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article Card (When not actively searching/filtering) */}
      {!searchQuery && selectedCategory === 'All' && featuredArticle && (
        <div
          onClick={() => setActiveArticle(featuredArticle)}
          className="group relative w-full overflow-hidden rounded-3xl border border-amber-500/30 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-500 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Photo */}
          <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
              Featured Story
            </span>
            {featuredArticle.videoUrl && (
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white border border-white/20">
                <Play className="h-3 w-3 text-red-400 fill-red-400" />
                Includes Video
              </span>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-amber-700 font-semibold">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-900 font-bold">
                  {featuredArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                {currentLang === 'ru' && featuredArticle.titleRu
                  ? featuredArticle.titleRu
                  : featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif-culture">
                {currentLang === 'ru' && featuredArticle.excerptRu
                  ? featuredArticle.excerptRu
                  : featuredArticle.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-bold text-slate-700">{featuredArticle.author}</span>
                <span>•</span>
                <span>{featuredArticle.date}</span>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditArticle(featuredArticle);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1"
                    title="Edit article & photo (Admin)"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                <span className="flex items-center gap-1 font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                  <span>Read Story</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {filteredArticles.map((article) => {
          return (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-xl cursor-pointer"
            >
              {/* Cover Photo */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200">
                  {article.category}
                </span>
                {article.videoUrl && (
                  <span className="absolute top-3 right-3 rounded-full bg-red-600/90 text-white p-1 shadow-sm" title="Includes Video">
                    <Play className="h-3 w-3 fill-white" />
                  </span>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {currentLang === 'ru' && article.titleRu ? article.titleRu : article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-serif-culture line-clamp-3">
                    {currentLang === 'ru' && article.excerptRu ? article.excerptRu : article.excerpt}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Byline & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold truncate max-w-[130px]">
                    by {article.author}
                  </span>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditArticle(article);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                          title="Edit article & photo (Admin)"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteArticle(article.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete article (Admin)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    <span className="font-bold text-amber-700 flex items-center gap-1">
                      <span>Read</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="font-cinzel text-lg font-bold text-slate-700">No articles found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or selecting a different category.</p>
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#0d1424] text-slate-200 shadow-2xl scrollbar-thin">
            {/* Top Action Bar in Modal */}
            <div className="sticky top-4 right-4 z-20 flex items-center justify-end gap-2 px-4">
              {isAdmin && (
                <button
                  onClick={() => {
                    handleStartEditArticle(activeArticle);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs shadow-lg transition-colors cursor-pointer"
                  title="Edit article and photo (Admin)"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Article & Photo</span>
                </button>
              )}
              <button
                onClick={() => setActiveArticle(null)}
                className="rounded-full bg-slate-900/90 border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Article Cover Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden -mt-12 bg-slate-950">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-black/40" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md">
                  {activeArticle.category}
                </span>
                <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {currentLang === 'ru' && activeArticle.titleRu
                    ? activeArticle.titleRu
                    : activeArticle.title}
                </h1>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Subheading */}
              {activeArticle.heading && (
                <p className="text-sm sm:text-base text-amber-200/90 font-serif-culture italic border-l-2 border-amber-500 pl-4">
                  {currentLang === 'ru' && activeArticle.headingRu
                    ? activeArticle.headingRu
                    : activeArticle.heading}
                </p>
              )}

              {/* Byline and Date */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-y border-slate-800 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">
                    {activeArticle.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{activeArticle.author}</span>
                    <span className="text-[11px] text-slate-400">Contributor & Cultural Specialist</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-amber-400" />
                    {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {activeArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Optional Video Embed */}
              {activeArticle.videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-lg">
                  <iframe
                    src={activeArticle.videoUrl}
                    title={activeArticle.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}

              {/* Full Article Text */}
              <div className="text-slate-300 leading-relaxed font-serif-culture text-sm sm:text-base space-y-4 whitespace-pre-line">
                {currentLang === 'ru' && activeArticle.contentRu
                  ? activeArticle.contentRu
                  : activeArticle.content}
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-400">Tags:</span>
                {activeArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-amber-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Modal Bottom Close */}
              <div className="pt-4 flex justify-end gap-3">
                {isAdmin && (
                  <button
                    onClick={() => {
                      handleStartEditArticle(activeArticle);
                    }}
                    className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Article</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Write New Article Modal */}
      {isAdmin && isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0c1424] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <PenTool className="h-5 w-5 text-amber-400" />
                <span>Write & Publish Article (Admin)</span>
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Heading / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Architectural Echoes of St. Petersburg and Varanasi"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Russian Title (Optional)
                </label>
                <input
                  type="text"
                  value={newTitleRu}
                  onChange={(e) => setNewTitleRu(e.target.value)}
                  placeholder="e.g. Архитектурные параллели Санкт-Петербурга и Варанаси"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="Cultural Diplomacy">Cultural Diplomacy</option>
                    <option value="Archaeology & History">Archaeology & History</option>
                    <option value="Literature & Philosophy">Literature & Philosophy</option>
                    <option value="Heroism & Memory">Heroism & Memory</option>
                    <option value="Youth & Education">Youth & Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Author name..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Cover Photo: URL or Device Upload */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Cover Photo * (Paste Web URL or Upload Photo from Device/Phone)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or choose file"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
                  />
                  <label className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 cursor-pointer transition-colors shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const dataUrl = await readFileAsDataUrl(file);
                            setNewImage(dataUrl);
                          } catch (err: any) {
                            alert(err?.message || 'Failed to read image');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {newImage && (
                  <div className="relative mt-2 h-32 w-full rounded-xl overflow-hidden border border-slate-700">
                    <img src={newImage} alt="Cover preview" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                      Photo Ready
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Embedded Video URL (Optional YouTube)
                  </label>
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Culture, Heritage, Youth"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Excerpt / Abstract *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Short summary displayed on cards..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Article Body (Rich Text / Paragraphs) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Full narrative of your article or blog post..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-serif-culture text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-amber-400 cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Article Modal */}
      {isAdmin && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0c1424] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" />
                <span>Edit Article, Photo & Content (Admin)</span>
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditArticle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Heading / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Russian Title
                </label>
                <input
                  type="text"
                  value={editTitleRu}
                  onChange={(e) => setEditTitleRu(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Subheading / Kicker
                </label>
                <input
                  type="text"
                  value={editHeading}
                  onChange={(e) => setEditHeading(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="Cultural Diplomacy">Cultural Diplomacy</option>
                    <option value="Archaeology & History">Archaeology & History</option>
                    <option value="Literature & Philosophy">Literature & Philosophy</option>
                    <option value="Heroism & Memory">Heroism & Memory</option>
                    <option value="Youth & Education">Youth & Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Cover Photo: URL or Device Upload */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Article Photo * (Edit Image URL or Upload New Photo from Device/Phone)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://... or choose photo"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
                  />
                  <label className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 cursor-pointer transition-colors shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const dataUrl = await readFileAsDataUrl(file);
                            setEditImage(dataUrl);
                          } catch (err: any) {
                            alert(err?.message || 'Failed to read image');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {editImage && (
                  <div className="relative mt-2 h-36 w-full rounded-xl overflow-hidden border border-slate-700">
                    <img src={editImage} alt="Cover preview" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                      New Photo Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Embedded Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={editReadTime}
                    onChange={(e) => setEditReadTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Excerpt / Abstract *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Russian Excerpt (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editExcerptRu}
                  onChange={(e) => setEditExcerptRu(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Article Body (English) *
                </label>
                <textarea
                  required
                  rows={7}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-serif-culture text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Article Body (Russian, Optional)
                </label>
                <textarea
                  rows={6}
                  value={editContentRu}
                  onChange={(e) => setEditContentRu(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-serif-culture text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-6 py-2.5 font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-400 cursor-pointer"
                >
                  Save Article & Photo Edits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
