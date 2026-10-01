import React, { useState, useEffect } from 'react';
import { Language, Region, VideoItem, SoulStoryEpisode, Opportunity } from './types';
import { initialRussianRegions, initialIndianRegions } from './data/regionsData';
import { soulStoriesData, heritageVideosData } from './data/videosData';
import { authorsData } from './data/literatureData';
import { initialOpportunities } from './data/opportunitiesData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HeritageView } from './components/HeritageView';
import { ArchaeologyView } from './components/ArchaeologyView';
import { LanguageView } from './components/LanguageView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ConnectionsView } from './components/ConnectionsView';
import { LiteratureView } from './components/LiteratureView';
import { GamesView } from './components/GamesView';
import { AboutView } from './components/AboutView';
import { RegionModal } from './components/RegionModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AmbientCulturalBackground } from './components/AmbientCulturalBackground';
import { fetchOpportunitiesFromSupabase, insertOpportunityToSupabase } from './lib/supabase';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('sri_lang');
    return saved === 'ru' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const [activeSection, setActiveSection] = useState<string>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals state
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeVideo, setActiveVideo] = useState<(VideoItem | SoulStoryEpisode) | null>(null);

  // Dynamic datasets
  const allRegions = [...initialRussianRegions, ...initialIndianRegions];
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  // Sync opportunities with Supabase backend
  useEffect(() => {
    fetchOpportunitiesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setOpportunities(data);
      }
    });
  }, []);

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

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOpportunity = async (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
    await insertOpportunityToSupabase(newOpp);
  };

  const handlePlayFeaturedVideo = () => {
    if (soulStoriesData.length > 0) {
      setActiveVideo(soulStoriesData[0]);
    }
  };

  const handleSelectRegionById = (regionId: string) => {
    const target = allRegions.find((r) => r.id === regionId);
    if (target) {
      setSelectedRegion(target);
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#eef4f9] text-slate-800 selection:bg-amber-500 selection:text-white font-sans flex flex-col items-center">
      {/* Living Ambient Cultural Atmosphere (Russia ⇄ India) */}
      <AmbientCulturalBackground />

      {/* Top Sticky Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative w-full max-w-full overflow-x-hidden flex-1 flex flex-col items-center">
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
              soulStories={soulStoriesData}
              heritageVideos={heritageVideosData}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
              onPlayVideo={(v) => setActiveVideo(v)}
            />
          )}

          {activeSection === 'archaeology' && <ArchaeologyView currentLang={currentLang} />}

          {activeSection === 'language' && <LanguageView currentLang={currentLang} />}

          {activeSection === 'opportunities' && (
            <OpportunitiesView
              currentLang={currentLang}
              opportunities={opportunities}
              onAddOpportunity={handleAddOpportunity}
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

      {/* Region Dossier Modal */}
      <RegionModal
        region={selectedRegion}
        currentLang={currentLang}
        onClose={() => setSelectedRegion(null)}
        onPlayVideo={(region) => {
          if (region.videoUrl) {
            setActiveVideo({
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

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        currentLang={currentLang}
        onClose={() => setActiveVideo(null)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        regions={allRegions}
        soulStories={soulStoriesData}
        heritageVideos={heritageVideosData}
        authors={authorsData}
        opportunities={opportunities}
        currentLang={currentLang}
        onSelectRegion={(region) => setSelectedRegion(region)}
        onSelectVideo={(video) => setActiveVideo(video)}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
