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
import { AchievementsView } from './components/AchievementsView';
import { RegionModal } from './components/RegionModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientCulturalBackground } from './components/AmbientCulturalBackground';
import { fetchOpportunitiesFromSupabase, insertOpportunityToSupabase } from './lib/supabase';
import { savePersistentItem, loadPersistentItem } from './utils/persistentStore';

function mergeRegionsWithDefaults(parsed: Region[], defaultRegions: Region[]): Region[] {
  const savedMap = new Map<string, Region>();
  parsed.forEach((r) => {
    if (r && r.id) savedMap.set(r.id, r);
  });
  const mergedDefaults = defaultRegions.map((def) => {
    const existing = savedMap.get(def.id);
    if (!existing) return def;
    return { ...def, ...existing };
  });
  const defaultIds = new Set(defaultRegions.map((d) => d.id));
  const customAdded = parsed.filter((r) => r && r.id && !defaultIds.has(r.id));
  return [...customAdded, ...mergedDefaults];
}

function getInitialSection(): string {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '').trim().toLowerCase();
  const validSections = [
    'home',
    'heritage',
    'archaeology',
    'victory',
    'articles',
    'language',
    'opportunities',
    'connections',
    'literature',
    'games',
    'achievements',
    'about',
  ];
  return validSections.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('sri_lang');
    return saved === 'ru' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const [activeSection, setActiveSection] = useState<string>(() => {
    return getInitialSection();
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

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

  // Dynamic datasets (with IndexedDB + localStorage persistence for admin additions/deletions/edits)
  const [allRegions, setAllRegions] = useState<Region[]>(() => {
    const defaultRegions = [...initialRussianRegions, ...initialIndianRegions];
    const saved = localStorage.getItem('sri_custom_regions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeRegionsWithDefaults(parsed, defaultRegions);
        }
      } catch (e) {}
    }
    return defaultRegions;
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

  // Hydrate large datasets from IndexedDB on mount (survives reloads even when localStorage 5MB quota is exceeded)
  useEffect(() => {
    const defaultRegions = [...initialRussianRegions, ...initialIndianRegions];
    loadPersistentItem<Region[]>('sri_custom_regions').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) {
        setAllRegions(mergeRegionsWithDefaults(saved, defaultRegions));
      }
    });
    loadPersistentItem<SoulStoryEpisode[]>('sri_custom_soul_stories').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) setSoulStories(saved);
    });
    loadPersistentItem<VideoItem[]>('sri_custom_videos').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) setHeritageVideos(saved);
    });
    loadPersistentItem<Opportunity[]>('sri_custom_opportunities').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) setOpportunities(saved);
    });
  }, []);

  // Sync opportunities with Supabase backend
  useEffect(() => {
    fetchOpportunitiesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setOpportunities((current) => {
          // Keep newly added custom items and merge unique
          const existingIds = new Set(data.map((d) => d.id));
          const customs = current.filter((c) => !existingIds.has(c.id));
          const merged = [...customs, ...data];
          void savePersistentItem('sri_custom_opportunities', merged);
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

  // Listen to browser URL hash changes for back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const section = getInitialSection();
      if (section !== activeSection) {
        setActiveSection(section);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [activeSection]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'home') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      window.location.hash = section;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVideo = (video: VideoItem | SoulStoryEpisode) => {
    setActiveVideo(video);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  const handleOpenRegion = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleCloseRegion = () => {
    setSelectedRegion(null);
  };

  const handleAddOpportunity = async (newOpp: Opportunity) => {
    setOpportunities((prev) => {
      const updated = [newOpp, ...prev];
      void savePersistentItem('sri_custom_opportunities', updated);
      return updated;
    });
    await insertOpportunityToSupabase(newOpp);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    setOpportunities((prev) => {
      const updated = prev.filter((o) => o.id !== oppId);
      void savePersistentItem('sri_custom_opportunities', updated);
      return updated;
    });
  };

  const handleAddVideo = (newVid: VideoItem) => {
    setHeritageVideos((prev) => {
      const updated = [newVid, ...prev];
      void savePersistentItem('sri_custom_videos', updated);
      return updated;
    });
  };

  const handleDeleteVideo = (vidId: string) => {
    setHeritageVideos((prev) => {
      const updated = prev.filter((v) => v.id !== vidId);
      void savePersistentItem('sri_custom_videos', updated);
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
      void savePersistentItem('sri_custom_videos', updated);
      return updated;
    });

    // 2. Update soulStories if present
    setSoulStories((prev) => {
      const exists = prev.some((s) => s.id === videoId);
      if (!exists) return prev;
      const updated = prev.map((s) => (s.id === videoId ? { ...s, ...updates } : s));
      void savePersistentItem('sri_custom_soul_stories', updated);
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
      void savePersistentItem('sri_custom_regions', updated);
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

  const handleUpdateRegion = (updatedRegion: Region) => {
    setAllRegions((prev) => {
      const updated = prev.map((r) => (r.id === updatedRegion.id ? updatedRegion : r));
      void savePersistentItem('sri_custom_regions', updated);
      return updated;
    });
    if (selectedRegion?.id === updatedRegion.id) {
      setSelectedRegion(updatedRegion);
    }
  };

  const handleAddRegion = (newRegion: Region) => {
    setAllRegions((prev) => {
      const updated = [newRegion, ...prev];
      void savePersistentItem('sri_custom_regions', updated);
      return updated;
    });
  };

  const handleDeleteRegion = (regionId: string) => {
    setAllRegions((prev) => {
      const updated = prev.filter((r) => r.id !== regionId);
      void savePersistentItem('sri_custom_regions', updated);
      return updated;
    });
    if (selectedRegion?.id === regionId) {
      setSelectedRegion(null);
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
              onAddRegion={handleAddRegion}
              onUpdateRegion={handleUpdateRegion}
              onDeleteRegion={handleDeleteRegion}
              onAddVideo={handleAddVideo}
              onDeleteVideo={handleDeleteVideo}
              onUpdateVideo={handleUpdateAnyVideo}
            />
          )}

          {activeSection === 'archaeology' && <ArchaeologyView currentLang={currentLang} isAdmin={isAdmin} />}

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

          {activeSection === 'literature' && <LiteratureView currentLang={currentLang} isAdmin={isAdmin} />}

          {activeSection === 'games' && <GamesView currentLang={currentLang} />}

          {activeSection === 'achievements' && (
            <AchievementsView currentLang={currentLang} isAdmin={isAdmin} />
          )}

          {activeSection === 'about' && (
            <AboutView currentLang={currentLang} onNavigate={handleNavigate} />
          )}
        </ErrorBoundary>
      </main>

      {/* Region Dossier Modal */}
      <RegionModal
        region={selectedRegion}
        currentLang={currentLang}
        onClose={handleCloseRegion}
        isAdmin={isAdmin}
        onUpdateRegion={handleUpdateRegion}
        onDeleteRegion={handleDeleteRegion}
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

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
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
