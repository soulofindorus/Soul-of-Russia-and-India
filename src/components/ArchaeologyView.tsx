import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArchaeologicalSite, Language } from '../types';
import { archaeologicalSitesData } from '../data/archaeologyData';
import { translations } from '../i18n/translations';
import { 
  Landmark, 
  MapPin, 
  Search, 
  Layers, 
  Sparkles, 
  Maximize2, 
  X, 
  Compass, 
  Calendar, 
  Pickaxe, 
  Globe2, 
  Award, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  Camera,
  Share2,
  Check,
} from 'lucide-react';
import { copyToClipboard, getDirectLinksForSection } from '../utils/routing';

interface ArchaeologyViewProps {
  currentLang: Language;
}

export const ArchaeologyView: React.FC<ArchaeologyViewProps> = ({ currentLang }) => {
  const [selectedSite, setSelectedSite] = useState<ArchaeologicalSite | null>(null);
  const [dossierSite, setDossierSite] = useState<ArchaeologicalSite | null>(null);
  const [countryFilter, setCountryFilter] = useState<'All' | 'Russia' | 'India'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);

  const handleCopyDirectLink = async () => {
    const links = getDirectLinksForSection('archaeology');
    const success = await copyToClipboard(links.hashUrl);
    if (success) {
      setCopiedDirectLink(true);
      setTimeout(() => setCopiedDirectLink(false), 2500);
    }
  };
  const [layerMode, setLayerMode] = useState<'satellite' | 'dark' | 'topo'>('satellite');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeMap, setActiveMap] = useState<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const t = translations[currentLang];
  const archT = t.archaeology || {
    title: 'Ancient Archaeology of Russia and India',
    subtitle: 'Discover prehistoric civilizations, Bronze Age citadels, Harappan metropolises, Viking mound landscapes, and ancient Greco-Scythian submerged ruins.',
    filterAll: 'All Sites',
    filterRussia: 'Russia',
    filterIndia: 'India',
    satelliteMapTitle: 'Eurasian Archaeological Satellite Map',
    satelliteMapSubtitle: 'Click on any site photo or marker to fly to its coordinates, inspect excavation strata, and explore ancient relics.',
    flyToMap: 'Locate on Satellite Map',
    viewDossier: 'Inspect Archaeological Dossier',
    keyArtifacts: 'Key Excavated Relics',
    excavationHighlights: 'Excavation Breakthroughs',
    eurasianLink: 'Indo-Eurasian Civilizational Connection',
    unescoHeritage: 'World Heritage Reserve',
    ageLabel: 'Chronological Epoch',
    discoveredLabel: 'Discovery & Excavators',
    civilizationLabel: 'Civilization',
    searchPlaceholder: 'Search archaeological sites, relics, Harappa, Gnezdovo, Phanagoria...',
    closeModal: 'Close Dossier',
  };

  // Filter sites based on country & search query
  const filteredSites = archaeologicalSitesData.filter((site) => {
    const matchesCountry = countryFilter === 'All' || site.country === countryFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCountry;

    const matchesName = 
      site.name.toLowerCase().includes(q) ||
      site.nameRu.toLowerCase().includes(q) ||
      site.nameHi.toLowerCase().includes(q);
    const matchesRegion =
      site.region.toLowerCase().includes(q) ||
      site.regionRu.toLowerCase().includes(q) ||
      site.regionHi.toLowerCase().includes(q);
    const matchesCivilization =
      site.civilization.toLowerCase().includes(q) ||
      site.civilizationRu.toLowerCase().includes(q);
    const matchesArtifact = site.keyArtifacts.some(a => 
      a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
    );

    return matchesCountry && (matchesName || matchesRegion || matchesCivilization || matchesArtifact);
  });

  // Create custom archaeology icon
  const createArchaeologyIcon = (site: ArchaeologicalSite, isSelected: boolean) => {
    const isIndia = site.country === 'India';
    const flag = isIndia ? '🇮🇳' : '🇷🇺';
    const accentColor = isIndia ? '#f59e0b' : '#38bdf8';
    const glowShadow = isSelected
      ? '0 0 25px 6px rgba(245, 158, 11, 0.95)'
      : '0 0 12px 2px rgba(0, 0, 0, 0.7)';

    return L.divIcon({
      className: 'archaeology-unique-marker',
      iconSize: [46, 46],
      iconAnchor: [23, 23],
      popupAnchor: [0, -24],
      html: `
        <div style="
          position: relative;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          ${isSelected ? `
            <div style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background: ${accentColor};
              opacity: 0.45;
              animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #090d16;
            border: 2.5px solid ${isSelected ? '#fbbf24' : accentColor};
            box-shadow: ${glowShadow};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(135deg, #1e293b, #0f172a);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            ">
              <span style="font-size: 16px; line-height: 1;">🏛️</span>
              <span style="
                position: absolute;
                bottom: -5px;
                right: -5px;
                font-size: 11px;
                line-height: 1;
                background: #000;
                border-radius: 50%;
                padding: 1px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.8);
              ">${flag}</span>
            </div>
          </div>
        </div>
      `,
    });
  };

  // Initialize and teardown Map cleanly (StrictMode safe)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Prevent "Map container is already initialized" error
    if ((container as any)._leaflet_id) {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing map instance', e);
        }
        mapInstanceRef.current = null;
      }
      delete (container as any)._leaflet_id;
    }

    let map: L.Map;
    try {
      map = L.map(container, {
        center: [38, 60], // Centered across Eurasia between Russia and India
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false, // Absolutely NO watermarks or logos
      });
    } catch (err) {
      console.warn('Leaflet map initialization guarded in ArchaeologyView:', err);
      return;
    }

    const tileGroup = L.layerGroup().addTo(map);
    tileLayerGroupRef.current = tileGroup;
    mapInstanceRef.current = map;
    setActiveMap(map);

    // Update tile layer initially
    updateTileLayer(tileGroup, layerMode);

    // Invalidate size on resize
    const resizeObserver = new ResizeObserver(() => {
      try {
        map.invalidateSize();
      } catch {
        // ignore if map unmounted
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error on map cleanup', e);
        }
        mapInstanceRef.current = null;
      }
      setActiveMap(null);
      tileLayerGroupRef.current = null;
    };
  }, []);

  const updateTileLayer = (tileGroup: L.LayerGroup, mode: 'satellite' | 'dark' | 'topo') => {
    tileGroup.clearLayers();
    let tileUrl = '';

    if (mode === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mode === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
    } else {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '',
    }).addTo(tileGroup);
  };

  // Update Tile Layer when layerMode changes
  useEffect(() => {
    if (tileLayerGroupRef.current) {
      updateTileLayer(tileLayerGroupRef.current, layerMode);
    }
  }, [layerMode, activeMap]);

  // Update markers when map, currentLang, or selectedSite changes
  useEffect(() => {
    if (!activeMap) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => {
      try {
        m.remove();
      } catch {
        // ignore
      }
    });
    markersRef.current = {};

    archaeologicalSitesData.forEach((site) => {
      const isSelected = selectedSite?.id === site.id;
      const markerIcon = createArchaeologyIcon(site, isSelected);

      const marker = L.marker([site.lat, site.lng], { icon: markerIcon }).addTo(activeMap);

      // Popup Content
      const localizedName = currentLang === 'ru' ? site.nameRu : currentLang === 'hi' ? site.nameHi : site.name;
      const localizedRegion = currentLang === 'ru' ? site.regionRu : currentLang === 'hi' ? site.regionHi : site.region;
      const localizedAge = currentLang === 'ru' ? site.ageRu : currentLang === 'hi' ? site.ageHi : site.age;

      const popupHtml = `
        <div style="font-family: inherit; color: #f8fafc; min-width: 240px; max-width: 280px; padding: 4px;">
          <div style="position: relative; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${site.imageUrl}" alt="${localizedName}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); font-size: 11px; padding: 2px 6px; border-radius: 4px; color: #fbbf24; border: 1px solid rgba(251,191,36,0.3);">
              ${site.country === 'India' ? '🇮🇳 India' : '🇷🇺 Russia'}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #f8fafc; line-height: 1.3;">
            ${localizedName}
          </h4>
          <p style="margin: 0 0 4px 0; font-size: 11px; color: #94a3b8;">
            📍 ${localizedRegion}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #cbd5e1;">
            ⏳ <strong>${localizedAge}</strong>
          </p>
          <div style="display: flex; gap: 6px;">
            <button id="popup-dossier-btn-${site.id}" style="
              width: 100%;
              background: linear-gradient(135deg, #d97706, #b45309);
              color: white;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              🔍 ${archT.viewDossier}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'dark-archaeology-popup',
        maxWidth: 300,
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-dossier-btn-${site.id}`);
        if (btn) {
          btn.onclick = () => {
            setDossierSite(site);
          };
        }
      });

      marker.on('click', () => {
        setSelectedSite(site);
      });

      markersRef.current[site.id] = marker;
    });
  }, [activeMap, currentLang, selectedSite?.id, archT.viewDossier]);

  // Handle clicking on photo / card: Fly map to coordinates, pulse marker, and open popup
  const handleSitePhotoClick = (site: ArchaeologicalSite) => {
    setSelectedSite(site);

    const map = mapInstanceRef.current;
    if (map) {
      // Smoothly fly to the exact coordinates with cinematic zoom
      map.flyTo([site.lat, site.lng], 8, {
        duration: 1.6,
        easeLinearity: 0.25,
      });

      // Scroll smoothly to map if not in full view
      if (mapContainerRef.current) {
        mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Open marker popup after flight
      map.once('moveend', () => {
        const marker = markersRef.current[site.id];
        if (marker) {
          try {
            marker.openPopup();
          } catch {
            // ignore if map moving
          }
        }
      });
    }
  };

  const getLocalizedName = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.nameRu;
    if (currentLang === 'hi') return site.nameHi;
    return site.name;
  };

  const getLocalizedRegion = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.regionRu;
    if (currentLang === 'hi') return site.regionHi;
    return site.region;
  };

  const getLocalizedCivilization = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.civilizationRu;
    if (currentLang === 'hi') return site.civilizationHi;
    return site.civilization;
  };

  const getLocalizedAge = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.ageRu;
    if (currentLang === 'hi') return site.ageHi;
    return site.age;
  };

  const getLocalizedShortDesc = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.shortDescriptionRu;
    if (currentLang === 'hi') return site.shortDescriptionHi;
    return site.shortDescription;
  };

  const getLocalizedDesc = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.descriptionRu;
    if (currentLang === 'hi') return site.descriptionHi;
    return site.description;
  };

  const getLocalizedSignificance = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.significanceRu;
    if (currentLang === 'hi') return site.significanceHi;
    return site.significance;
  };

  const getLocalizedLink = (site: ArchaeologicalSite) => {
    if (currentLang === 'ru') return site.indoEurasianLinkRu;
    if (currentLang === 'hi') return site.indoEurasianLinkHi;
    return site.indoEurasianLink;
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 pb-24 w-full flex flex-col items-center overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative w-full overflow-hidden border-b border-amber-500/20 bg-gradient-to-b from-white/80 via-white/50 to-transparent py-12 sm:py-16 px-3 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.1),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl w-full">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex max-w-[95vw] flex-wrap items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-amber-800 shadow-sm backdrop-blur-md mb-6">
              <Landmark className="h-4 w-4 text-amber-600" />
              <span>EURASIAN PREHISTORIC & ANCIENT CIVILIZATIONS</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-slate-900 max-w-4xl leading-tight break-words">
              {archT.title}
            </h1>

            <p className="mt-4 max-w-3xl text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              {archT.subtitle}
            </p>

            {/* Quick Country Highlight Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-xs font-semibold text-amber-800 shadow-sm">
                🇮🇳 Indus Valley Civilisation (Dholavira, Lothal, Rakhigarhi)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-xs font-semibold text-blue-800 shadow-sm">
                🇷🇺 Ancient Greek & Bosporan (Phanagoria on Taman Peninsula)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-xs font-semibold text-emerald-800 shadow-sm">
                🇷🇺 Viking-Slavic Metropolis (Gnezdovo on Dnieper)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-xs font-semibold text-purple-800 shadow-sm">
                🇷🇺 Sintashta-Arkaim & Denisova Cave
              </span>
              <button
                onClick={handleCopyDirectLink}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                  copiedDirectLink
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
                title="Copy Direct Link to Archaeology Section"
              >
                {copiedDirectLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Copied Direct Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-amber-700" />
                    <span>Share: archaeology.*</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Interactive Satellite Map Section */}
        <div className="mb-12 rounded-2xl border border-amber-500/25 bg-[#0b101c] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100">
                  {archT.satelliteMapTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {archT.satelliteMapSubtitle}
              </p>
            </div>

            {/* Satellite Map Mode Switcher (No Watermark) */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/90 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setLayerMode('satellite')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  layerMode === 'satellite'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🛰️ Satellite View
              </button>
              <button
                onClick={() => setLayerMode('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  layerMode === 'dark'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🗺️ Dark Topo
              </button>
              <button
                onClick={() => setLayerMode('topo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  layerMode === 'topo'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ⛰️ Relief Map
              </button>
            </div>
          </div>

          {/* Leaflet Map Stage */}
          <div className="relative mt-4 h-[420px] sm:h-[500px] w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-inner">
            <div ref={mapContainerRef} className="h-full w-full z-10" />

            {/* Floating Map Legend */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-[#070b13]/90 p-2.5 backdrop-blur-md text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="flex h-3 w-3 items-center justify-center rounded-full border border-amber-400 bg-amber-500/20 text-[8px]">
                  🇮🇳
                </span>
                <span>Indian Archaeological Sites</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="flex h-3 w-3 items-center justify-center rounded-full border border-sky-400 bg-sky-500/20 text-[8px]">
                  🇷🇺
                </span>
                <span>Russian Archaeological Sites</span>
              </div>
            </div>

            {/* Selected site indicator overlay */}
            {selectedSite && (
              <div className="absolute top-4 right-4 z-20 max-w-xs rounded-xl border border-amber-500/40 bg-[#0b101c]/95 p-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Selected Site
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                      {getLocalizedName(selectedSite)}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {getLocalizedRegion(selectedSite)}
                    </p>
                  </div>
                  <button
                    onClick={() => setDossierSite(selectedSite)}
                    className="rounded bg-amber-500/20 p-1.5 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                    title={archT.viewDossier}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Country Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setCountryFilter('All')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                countryFilter === 'All'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {archT.filterAll} ({archaeologicalSitesData.length})
            </button>
            <button
              onClick={() => setCountryFilter('India')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                countryFilter === 'India'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳</span> {archT.filterIndia} (4)
            </button>
            <button
              onClick={() => setCountryFilter('Russia')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                countryFilter === 'Russia'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇷🇺</span> {archT.filterRussia} (4)
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={archT.searchPlaceholder}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Site Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => {
            const isSelected = selectedSite?.id === site.id;
            const localizedName = getLocalizedName(site);
            const localizedRegion = getLocalizedRegion(site);
            const localizedCivilization = getLocalizedCivilization(site);
            const localizedAge = getLocalizedAge(site);
            const localizedShortDesc = getLocalizedShortDesc(site);

            return (
              <div
                key={site.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#0b101c] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/10'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div>
                  {/* Photo Container with Click-to-Map action and Real Photo Badge */}
                  <div 
                    onClick={() => handleSitePhotoClick(site)}
                    className="relative h-60 w-full cursor-pointer overflow-hidden bg-slate-950 group/photo"
                  >
                    <img
                      src={site.imageUrl}
                      alt={localizedName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b101c] via-black/20 to-black/50" />

                    {/* Top Bar: Country Badge & Authentic Photo Pill & UNESCO */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-lg">
                        <span>{site.country === 'India' ? '🇮🇳 India' : '🇷🇺 Russia'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {site.unescoStatus && (
                          <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 shadow-md">
                            <Award className="h-3 w-3" />
                            <span>UNESCO</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/40 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                          <Camera className="h-3 w-3" />
                          <span>{currentLang === 'ru' ? 'Фото раскопок' : currentLang === 'hi' ? 'वास्तविक तस्वीर' : 'Authentic Record'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Hover Actions overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur-[2px] p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSitePhotoClick(site);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl hover:bg-amber-400 hover:scale-105 transition-all"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{archT.flyToMap}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDossierSite(site);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl hover:bg-slate-700 hover:border-amber-500/50 hover:scale-105 transition-all"
                      >
                        <Eye className="h-4 w-4 text-amber-400" />
                        <span>{currentLang === 'ru' ? 'Досье' : currentLang === 'hi' ? 'विवरण' : 'Dossier'}</span>
                      </button>
                    </div>

                    {/* Civilizational Period banner */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="inline-block rounded-md bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-amber-300 border border-amber-500/30 shadow-md">
                        {localizedCivilization}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{localizedRegion}</span>
                    </div>

                    <h3 className="mt-2 text-lg font-serif font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {localizedName}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{localizedAge}</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {localizedShortDesc}
                    </p>

                    {/* Key Relics Chips */}
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {archT.keyArtifacts}:
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {site.keyArtifacts.slice(0, 2).map((artifact, i) => (
                          <span
                            key={i}
                            className="inline-block rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60"
                          >
                            💎 {artifact.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleSitePhotoClick(site)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>{archT.flyToMap}</span>
                  </button>

                  <button
                    onClick={() => setDossierSite(site)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{archT.viewDossier}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Archaeological Dossier Modal */}
      {dossierSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/40 bg-[#0b101c] shadow-2xl p-6 sm:p-8">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setDossierSite(null)}
              className="absolute top-5 right-5 rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-400">
                {dossierSite.country === 'India' ? '🇮🇳 Archaeological Site of India' : '🇷🇺 Archaeological Site of Russia'}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {getLocalizedCivilization(dossierSite)}
              </span>
              {dossierSite.unescoStatus && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950">
                  {dossierSite.unescoStatus}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-slate-50">
              {getLocalizedName(dossierSite)}
            </h2>

            <p className="mt-1 text-sm text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{getLocalizedRegion(dossierSite)}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{getLocalizedAge(dossierSite)}</span>
            </p>

            {/* Hero Image */}
            <div className="mt-5 relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-800">
              <img
                src={dossierSite.imageUrl}
                alt={getLocalizedName(dossierSite)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400 shadow-xl">
                <Camera className="h-3.5 w-3.5" />
                <span>{currentLang === 'ru' ? 'Реальное фото раскопок и артефактов' : currentLang === 'hi' ? 'वास्तविक पुरातात्विक उत्खनन रिकॉर्ड' : 'Authentic Archaeological Excavation Record'}</span>
              </div>

              <button
                onClick={() => {
                  handleSitePhotoClick(dossierSite);
                  setDossierSite(null);
                }}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-xl hover:bg-amber-400 transition"
              >
                <Compass className="h-4 w-4" />
                <span>{archT.flyToMap}</span>
              </button>
            </div>

            {/* Discovery & Excavators Note */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Pickaxe className="h-4 w-4" />
                <span>{archT.discoveredLabel}</span>
              </div>
              <p className="mt-1 text-sm text-slate-200">
                {dossierSite.discovered}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="mt-6">
              <h3 className="text-lg font-serif font-bold text-slate-100">
                Comprehensive Architectural & Historical Overview
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {getLocalizedDesc(dossierSite)}
              </p>
            </div>

            {/* Archaeological Significance */}
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Archaeological Significance & Hydraulics / Stratigraphy</span>
              </div>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {getLocalizedSignificance(dossierSite)}
              </p>
            </div>

            {/* Key Artifacts Showcase */}
            <div className="mt-6">
              <h3 className="text-lg font-serif font-bold text-slate-100">
                {archT.keyArtifacts}
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dossierSite.keyArtifacts.map((artifact, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5"
                  >
                    <span className="text-base">💎</span>
                    <h4 className="mt-1 text-xs font-bold text-amber-300">
                      {artifact.name}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      {artifact.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Excavation Highlights */}
            <div className="mt-6">
              <h3 className="text-lg font-serif font-bold text-slate-100">
                {archT.excavationHighlights}
              </h3>
              <ul className="mt-3 space-y-2">
                {dossierSite.excavationHighlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                      ✓
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Indo-Eurasian Connection */}
            <div className="mt-6 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Globe2 className="h-4 w-4" />
                <span>{archT.eurasianLink}</span>
              </div>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {getLocalizedLink(dossierSite)}
              </p>
            </div>

            {/* Bottom Modal Actions */}
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDossierSite(null)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                {archT.closeModal}
              </button>
              <button
                onClick={() => {
                  handleSitePhotoClick(dossierSite);
                  setDossierSite(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                <Compass className="h-4 w-4" />
                <span>{archT.flyToMap}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
