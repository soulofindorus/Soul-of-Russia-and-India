import React, { useState, useEffect } from 'react';
import { Language, Region, VideoItem, SoulStoryEpisode, Opportunity, VideoCategory } from './types';
import { initialRussianRegions, initialIndianRegions } from './data/regionsData';
import { soulStoriesData, heritageVideosData } from './data/videosData';
import { authorsData } from './data/literatureData';
import { initialOpportunities } from './data/opportunitiesData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HeritageView } from './components/HeritageView';
import { ArchaeologyView } from './components/ArchaeologyView';
import { VictoryView } from './components/VictoryView';
import { ArticlesView } from './components/ArticlesView';
import { LanguageView } from './components/LanguageView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ConnectionsView } from './components/ConnectionsView';
import { LiteratureView } from './components/LiteratureView';
import { GamesView } from './components/GamesView';
import { AboutView } from './components/AboutView';
import { RegionModal } from './components/RegionModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { DirectLinkModal } from './components/DirectLinkModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientCulturalBackground } from './components/AmbientCulturalBackground';
import { fetchOpportunitiesFromSupabase, insertOpportunityToSupabase } from './lib/supabase';
import { detectInitialRoute, syncBrowserUrl, getDirectLinksForSection, copyToClipboard } from './utils/routing';
import { Share2, Check, Copy } from 'lucide-react';

export default function App() {
  const initialRoute = detectInitialRoute();

  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (initialRoute.lang) return initialRoute.lang;
    const saved = localStorage.getItem('sri_lang');
    return saved === 'ru' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const [activeSection, setActiveSection] = useState<string>(() => {
    return initialRoute.section || 'home';
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDirectLinkModalOpen, setIsDirectLinkModalOpen] = useState<boolean>(false);
  const [quickLinkCopied, setQuickLinkCopied] = useState<boolean>(false);

  // Admin access state (restricted exclusively to authorized administrator)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sri_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('sri_admin_email') || '';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Modals state
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeVideo, setActiveVideo] = useState<(VideoItem | SoulStoryEpisode) | null>(null);

  // Dynamic datasets (with local storage persistence for admin additions/deletions/edits)
  const [allRegions, setAllRegions] = useState<Region[]>(() => {
    const saved = localStorage.getItem('sri_custom_regions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [...initialRussianRegions, ...initialIndianRegions];
  });

  const [soulStories, setSoulStories] = useState<SoulStoryEpisode[]>(() => {
    const saved = localStorage.getItem('sri_custom_soul_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return soulStoriesData;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('sri_custom_opportunities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialOpportunities;
  });

  const [heritageVideos, setHeritageVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('sri_custom_videos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return heritageVideosData;
  });

  // Sync opportunities with Supabase backend
  useEffect(() => {
    fetchOpportunitiesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setOpportunities((current) => {
          // Keep newly added custom items and merge unique
          const existingIds = new Set(data.map((d) => d.id));
          const customs = current.filter((c) => !existingIds.has(c.id));
          const merged = [...customs, ...data];
          try { localStorage.setItem('sri_custom_opportunities', JSON.stringify(merged)); } catch (e) {}
          return merged;
        });
      }
    });
  }, []);

  const handleAdminLogin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (cleanEmail === 'ritikbalwan23@gmail.com' && cleanPass === 'Ritik@1234') {
      setIsAdmin(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem('sri_admin_auth', 'true');
      localStorage.setItem('sri_admin_email', cleanEmail);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminEmail('');
    localStorage.removeItem('sri_admin_auth');
    localStorage.removeItem('sri_admin_email');
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('sri_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Unable to persist language to localStorage', e);
    }
  };

  // Sync with document lang and cross-tab/custom storage events
  useEffect(() => {
    document.documentElement.lang = currentLang;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sri_lang' && (e.newValue === 'ru' || e.newValue === 'hi' || e.newValue === 'en')) {
        setCurrentLang(e.newValue);
      }
    };

    const handleCustomLangChange = (e: Event) => {
      const customEvt = e as CustomEvent<Language>;
      if (customEvt.detail && (customEvt.detail === 'ru' || customEvt.detail === 'hi' || customEvt.detail === 'en')) {
        setCurrentLang(customEvt.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sri:lang-changed', handleCustomLangChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sri:lang-changed', handleCustomLangChange);
    };
  }, [currentLang]);

  // Handle initial deep links (direct video or direct region)
  useEffect(() => {
    if (initialRoute.videoId) {
      const matchStory = soulStories.find((s) => s.id === initialRoute.videoId);
      if (matchStory) {
        setActiveVideo(matchStory);
        return;
      }
      const matchVid = heritageVideos.find((v) => v.id === initialRoute.videoId);
      if (matchVid) {
        setActiveVideo(matchVid);
        return;
      }
      const matchRegVid = allRegions.find(
        (r) => r.id === initialRoute.videoId || `vid-${r.id}` === initialRoute.videoId
      );
      if (matchRegVid && matchRegVid.videoUrl) {
        setActiveVideo({
          id: `vid-${matchRegVid.id}`,
          title: matchRegVid.videoTitle || `${matchRegVid.name} Documentary`,
          titleRu: matchRegVid.nameRu,
          titleHi: matchRegVid.nameHi,
          country: matchRegVid.country,
          region: matchRegVid.name,
          category: 'Archaeology',
          thumbnail: matchRegVid.image,
          videoUrl: matchRegVid.videoUrl,
          shortDescription: matchRegVid.heritageInfo,
          date: '2026',
        });
        return;
      }
    }

    if (initialRoute.regionId) {
      const matchRegion = allRegions.find((r) => r.id === initialRoute.regionId);
      if (matchRegion) {
        setSelectedRegion(matchRegion);
      }
    }
  }, []);

  // Listen to browser URL changes (popstate & hashchange for back/forward and deep link navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      const route = detectInitialRoute();
      if (route.section && route.section !== activeSection) {
        setActiveSection(route.section);
      }
      if (route.videoId) {
        const matchStory = soulStories.find((s) => s.id === route.videoId);
        if (matchStory) {
          setActiveVideo(matchStory);
        } else {
          const matchVid = heritageVideos.find((v) => v.id === route.videoId);
          if (matchVid) setActiveVideo(matchVid);
        }
      }
      if (route.regionId) {
        const matchRegion = allRegions.find((r) => r.id === route.regionId);
        if (matchRegion) setSelectedRegion(matchRegion);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [activeSection, soulStories, heritageVideos, allRegions]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    syncBrowserUrl(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickCopySectionLink = async () => {
    const directInfo = getDirectLinksForSection(activeSection);
    const success = await copyToClipboard(directInfo.hashUrl);
    if (success) {
      setQuickLinkCopied(true);
      setTimeout(() => setQuickLinkCopied(false), 2200);
    }
  };

  const handleOpenVideo = (video: VideoItem | SoulStoryEpisode) => {
    setActiveVideo(video);
    syncBrowserUrl(activeSection, { videoId: video.id });
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    syncBrowserUrl(activeSection);
  };

  const handleOpenRegion = (region: Region) => {
    setSelectedRegion(region);
    syncBrowserUrl(activeSection, { regionId: region.id });
  };

  const handleCloseRegion = () => {
    setSelectedRegion(null);
    syncBrowserUrl(activeSection);
  };

  const handleAddOpportunity = async (newOpp: Opportunity) => {
    setOpportunities((prev) => {
      const updated = [newOpp, ...prev];
      try { localStorage.setItem('sri_custom_opportunities', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    await insertOpportunityToSupabase(newOpp);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    setOpportunities((prev) => {
      const updated = prev.filter((o) => o.id !== oppId);
      try { localStorage.setItem('sri_custom_opportunities', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleAddVideo = (newVid: VideoItem) => {
    setHeritageVideos((prev) => {
      const updated = [newVid, ...prev];
      try { localStorage.setItem('sri_custom_videos', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleDeleteVideo = (vidId: string) => {
    setHeritageVideos((prev) => {
      const updated = prev.filter((v) => v.id !== vidId);
      try { localStorage.setItem('sri_custom_videos', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleUpdateAnyVideo = (
    videoId: string,
    updates: {
      videoUrl: string;
      title?: string;
      titleRu?: string;
      titleHi?: string;
      thumbnail?: string;
      shortDescription?: string;
      duration?: string;
      category?: VideoCategory;
    }
  ) => {
    // 1. Update heritageVideos if present
    setHeritageVideos((prev) => {
      const exists = prev.some((v) => v.id === videoId);
      if (!exists) return prev;
      const updated = prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v));
      try { localStorage.setItem('sri_custom_videos', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    // 2. Update soulStories if present
    setSoulStories((prev) => {
      const exists = prev.some((s) => s.id === videoId);
      if (!exists) return prev;
      const updated = prev.map((s) => (s.id === videoId ? { ...s, ...updates } : s));
      try { localStorage.setItem('sri_custom_soul_stories', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    // 3. Update region video if matching
    setAllRegions((prev) => {
      const cleanRegId = videoId.replace(/^vid-/, '');
      const exists = prev.some((r) => r.id === cleanRegId || `vid-${r.id}` === videoId);
      if (!exists) return prev;
      const updated = prev.map((r) => {
        if (r.id === cleanRegId || `vid-${r.id}` === videoId) {
          return {
            ...r,
            videoUrl: updates.videoUrl,
            videoTitle: updates.title || r.videoTitle,
            image: updates.thumbnail || r.image,
          };
        }
        return r;
      });
      try { localStorage.setItem('sri_custom_regions', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    // 4. Update currently active video in modal if playing
    setActiveVideo((prev) => {
      if (!prev || prev.id !== videoId) return prev;
      return { ...prev, ...updates };
    });
  };

  const handlePlayFeaturedVideo = () => {
    if (soulStories.length > 0) {
      handleOpenVideo(soulStories[0]);
    }
  };

  const handleSelectRegionById = (regionId: string) => {
    const target = allRegions.find((r) => r.id === regionId);
    if (target) {
      handleOpenRegion(target);
    }
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden text-slate-800 selection:bg-amber-500 selection:text-white font-sans flex flex-col items-center">
      {/* Living Ambient Cultural Atmosphere (Russia ⇄ India) */}
      <AmbientCulturalBackground />

      {/* Top Sticky Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDirectLinks={() => setIsDirectLinkModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative z-10 w-full max-w-full overflow-x-hidden flex-1 flex flex-col items-center">
        <ErrorBoundary key={activeSection}>
          {activeSection === 'home' && (
            <HeroSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
              onPlayFeaturedVideo={handlePlayFeaturedVideo}
              onSelectRegion={handleSelectRegionById}
            />
          )}

          {activeSection === 'heritage' && (
            <HeritageView
              currentLang={currentLang}
              regions={allRegions}
              soulStories={soulStories}
              heritageVideos={heritageVideos}
              onSelectRegion={(reg) => handleOpenRegion(reg)}
              onPlayVideo={(v) => handleOpenVideo(v)}
              isAdmin={isAdmin}
              onAddVideo={handleAddVideo}
              onDeleteVideo={handleDeleteVideo}
              onUpdateVideo={handleUpdateAnyVideo}
            />
          )}

          {activeSection === 'archaeology' && <ArchaeologyView currentLang={currentLang} />}

          {activeSection === 'victory' && <VictoryView currentLang={currentLang} isAdmin={isAdmin} />}

          {activeSection === 'articles' && <ArticlesView currentLang={currentLang} isAdmin={isAdmin} />}

          {activeSection === 'language' && <LanguageView currentLang={currentLang} />}

          {activeSection === 'opportunities' && (
            <OpportunitiesView
              currentLang={currentLang}
              opportunities={opportunities}
              isAdmin={isAdmin}
              onAddOpportunity={handleAddOpportunity}
              onDeleteOpportunity={handleDeleteOpportunity}
            />
          )}

          {activeSection === 'connections' && <ConnectionsView currentLang={currentLang} />}

          {activeSection === 'literature' && <LiteratureView currentLang={currentLang} />}

          {activeSection === 'games' && <GamesView currentLang={currentLang} />}

          {activeSection === 'about' && (
            <AboutView currentLang={currentLang} onNavigate={handleNavigate} />
          )}
        </ErrorBoundary>
      </main>

      {/* Floating Direct Link Quick Pill */}
      <aside
        aria-label="Direct Link & DNS Subdomain Share"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 drop-shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <button
          onClick={handleQuickCopySectionLink}
          className={`group flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-all backdrop-blur-md border shadow-lg ${
            quickLinkCopied
              ? 'bg-emerald-600 text-white border-emerald-400 scale-105'
              : 'bg-white/95 text-slate-800 border-amber-400 hover:border-amber-500 hover:bg-amber-50'
          }`}
          title="Click to copy direct link for this section"
        >
          {quickLinkCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-white" />
              <span>Copied Direct Link!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] text-amber-800 font-bold hidden sm:inline">
                #{activeSection}
              </span>
              <span className="font-semibold">Copy Direct Link</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsDirectLinkModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-amber-400 border border-amber-500/50 px-3 py-2 text-xs font-bold shadow-lg hover:scale-105 transition-all"
          title="View all 11 DNS Subdomains & Direct Links Hub"
        >
          <span className="text-[10px] tracking-wider uppercase font-mono text-amber-300 font-bold">
            DNS & Subdomains
          </span>
        </button>
      </aside>

      {/* Region Dossier Modal */}
      <RegionModal
        region={selectedRegion}
        currentLang={currentLang}
        onClose={handleCloseRegion}
        onPlayVideo={(region) => {
          if (region.videoUrl) {
            handleOpenVideo({
              id: `vid-${region.id}`,
              title: region.videoTitle || `${region.name} Heritage Documentary`,
              titleRu: region.nameRu,
              titleHi: region.nameHi,
              country: region.country,
              region: region.name,
              category: 'Archaeology',
              thumbnail: region.image,
              videoUrl: region.videoUrl,
              shortDescription: region.heritageInfo,
              date: '2026',
            });
          }
        }}
      />

      {/* Video Player Modal with Admin Edit Capability */}
      <VideoPlayerModal
        video={activeVideo}
        currentLang={currentLang}
        onClose={handleCloseVideo}
        isAdmin={isAdmin}
        onUpdateVideo={handleUpdateAnyVideo}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        regions={allRegions}
        soulStories={soulStories}
        heritageVideos={heritageVideos}
        authors={authorsData}
        opportunities={opportunities}
        currentLang={currentLang}
        onSelectRegion={(region) => handleOpenRegion(region)}
        onSelectVideo={(video) => handleOpenVideo(video)}
        onNavigate={handleNavigate}
      />

      {/* Direct Links & Subdomain Hub Modal */}
      <DirectLinkModal
        isOpen={isDirectLinkModalOpen}
        onClose={() => setIsDirectLinkModalOpen(false)}
        activeSection={activeSection}
        currentLang={currentLang}
        onNavigateSection={(secId) => handleNavigate(secId)}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
        onOpenDirectLinks={() => setIsDirectLinkModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Authentication & Control Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        adminEmail={adminEmail}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
