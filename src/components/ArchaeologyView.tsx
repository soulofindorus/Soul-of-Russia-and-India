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
  Edit3,
  PlusCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import { readFileAsDataUrl, normalizeMediaUrl } from '../utils/imageUpload';
import { savePersistentItem, loadPersistentItem } from '../utils/persistentStore';

interface ArchaeologyViewProps {
  currentLang: Language;
  isAdmin?: boolean;
}

export const ArchaeologyView: React.FC<ArchaeologyViewProps> = ({ currentLang, isAdmin = false }) => {
  // Dynamic sites state with localStorage persistence
  const [sites, setSites] = useState<ArchaeologicalSite[]>(() => {
    const saved = localStorage.getItem('sri_custom_archaeology_sites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved archaeology sites', e);
      }
    }
    return archaeologicalSitesData;
  });

  useEffect(() => {
    loadPersistentItem<ArchaeologicalSite[]>('sri_custom_archaeology_sites').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) setSites(saved);
    });
  }, []);

  const [selectedSite, setSelectedSite] = useState<ArchaeologicalSite | null>(null);
  const [dossierSite, setDossierSite] = useState<ArchaeologicalSite | null>(null);
  const [editingSite, setEditingSite] = useState<ArchaeologicalSite | null>(null);
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);

  // Add Site Form state
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteNameRu, setNewSiteNameRu] = useState('');
  const [newSiteCountry, setNewSiteCountry] = useState<'Russia' | 'India'>('India');
  const [newSiteRegion, setNewSiteRegion] = useState('');
  const [newSiteLat, setNewSiteLat] = useState('23.88');
  const [newSiteLng, setNewSiteLng] = useState('70.21');
  const [newSitePeriod, setNewSitePeriod] = useState('Bronze Age');
  const [newSiteAge, setNewSiteAge] = useState('c. 2500 BCE');
  const [newSiteCivilization, setNewSiteCivilization] = useState('Indus Valley / Harappan');
  const [newSiteDesc, setNewSiteDesc] = useState('');
  const [newSiteImage, setNewSiteImage] = useState('');
  const [newSiteArtifacts, setNewSiteArtifacts] = useState('Terracotta seal, Bronze figurine');

  const [countryFilter, setCountryFilter] = useState<'All' | 'Russia' | 'India'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);

  const handleCopyDirectLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#archaeology`;
      await navigator.clipboard.writeText(url);
      setCopiedDirectLink(true);
      setTimeout(() => setCopiedDirectLink(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed', e);
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

  // Editing and uploading handlers
  const handleSiteImageUpload = async (file: File, isEditing: boolean) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (isEditing) {
        setEditingSite((prev) => (prev ? { ...prev, imageUrl: dataUrl } : null));
      } else {
        setNewSiteImage(dataUrl);
      }
    } catch (err) {
      console.error('Failed to read image file', err);
    }
  };

  const handleStartEditSite = (site: ArchaeologicalSite, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSite({ ...site });
  };

  const handleSaveEditSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;

    const normalizedSite = {
      ...editingSite,
      imageUrl: normalizeMediaUrl(editingSite.imageUrl),
    };

    setSites((prev) => {
      const updated = prev.map((s) => (s.id === editingSite.id ? normalizedSite : s));
      void savePersistentItem('sri_custom_archaeology_sites', updated);
      return updated;
    });

    if (selectedSite?.id === editingSite.id) setSelectedSite(normalizedSite);
    if (dossierSite?.id === editingSite.id) setDossierSite(normalizedSite);
    setEditingSite(null);
  };

  const handleDeleteSite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this archaeological site?')) {
      setSites((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        void savePersistentItem('sri_custom_archaeology_sites', updated);
        return updated;
      });
      if (selectedSite?.id === id) setSelectedSite(null);
      if (dossierSite?.id === id) setDossierSite(null);
    }
  };

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const artifactsArr = newSiteArtifacts
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item) => ({
        name: item,
        nameRu: item,
        nameHi: item,
        desc: 'Excavated historical artifact discovered at the archaeological site stratum.',
      }));

    const created: ArchaeologicalSite = {
      id: `arch-custom-${Date.now()}`,
      name: newSiteName.trim(),
      nameRu: newSiteNameRu.trim() || newSiteName.trim(),
      nameHi: newSiteName.trim(),
      country: newSiteCountry,
      region: newSiteRegion.trim() || (newSiteCountry === 'India' ? 'Gujarat, India' : 'Smolensk, Russia'),
      regionRu: newSiteRegion.trim() || (newSiteCountry === 'India' ? 'Гуджарат, Индия' : 'Смоленск, Россия'),
      regionHi: newSiteRegion.trim() || newSiteCountry,
      lat: parseFloat(newSiteLat) || 25.0,
      lng: parseFloat(newSiteLng) || 60.0,
      period: newSitePeriod.trim() || 'Ancient Antiquity',
      periodRu: newSitePeriod.trim() || 'Древность',
      periodHi: newSitePeriod.trim() || 'प्राचीन काल',
      age: newSiteAge.trim() || 'c. 3000 BCE',
      ageRu: newSiteAge.trim() || 'ок. 3000 до н.э.',
      ageHi: newSiteAge.trim() || 'लगभग 3000 ईसा पूर्व',
      discovered: 'System Archeological Mission',
      civilization: newSiteCivilization.trim() || 'Ancient Eurasian Culture',
      civilizationRu: newSiteCivilization.trim() || 'Древняя Евразийская Культура',
      civilizationHi: newSiteCivilization.trim() || 'प्राचीन सभ्यता',
      shortDescription: newSiteDesc.trim().slice(0, 160) || 'Archaeological site featuring ancient stone structures and strata.',
      shortDescriptionRu: newSiteDesc.trim().slice(0, 160) || 'Археологический памятник с древними каменными сооружениями.',
      shortDescriptionHi: newSiteDesc.trim().slice(0, 160),
      description: newSiteDesc.trim() || 'Full archaeological excavation strata detailing civilizational continuity and ancient Eurasian connections.',
      descriptionRu: newSiteDesc.trim() || 'Полный археологический разрез и культурные слои памятника.',
      descriptionHi: newSiteDesc.trim(),
      significance: 'Crucial node demonstrating early urban settlement and trade.',
      significanceRu: 'Важнейший узел ранней городской цивилизации.',
      significanceHi: 'महत्वपूर्ण पुरातात्विक केंद्र।',
      keyArtifacts: artifactsArr.length > 0 ? artifactsArr : [
        { name: 'Ceramic Pottery', nameRu: 'Керамика', nameHi: 'मिट्टी के बर्तन', desc: 'Ancient pottery shard with geometric slip.' }
      ],
      excavationHighlights: ['Stratigraphic layers well preserved', 'Evidence of metal smelting and bead workshops'],
      excavationHighlightsRu: ['Отличная сохранность стратиграфии', 'Следы металлургии и мастерских'],
      excavationHighlightsHi: ['परिरक्षित स्तर', 'प्राचीन कार्यशालाएं'],
      imageUrl: normalizeMediaUrl(newSiteImage.trim()) || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        normalizeMediaUrl(newSiteImage.trim()) || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
      ],
      unescoStatus: 'World Heritage Listed',
      indoEurasianLink: 'Linked to ancient Eurasian trade arteries spanning Central Asia, the Indus, and the Volga.',
      indoEurasianLinkRu: 'Связан с древними евразийскими путями между Индом, Волгой и Центральной Азией.',
      indoEurasianLinkHi: 'प्राचीन यूरेशियाई व्यापारिक मार्गों से जुड़ा हुआ स्थल।',
    };

    setSites((prev) => {
      const updated = [created, ...prev];
      void savePersistentItem('sri_custom_archaeology_sites', updated);
      return updated;
    });

    setIsAddSiteModalOpen(false);
    setNewSiteName('');
    setNewSiteNameRu('');
    setNewSiteRegion('');
    setNewSiteDesc('');
    setNewSiteImage('');
  };

  // Filter sites based on country & search query
  const filteredSites = sites.filter((site) => {
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

    sites.forEach((site) => {
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
  }, [activeMap, currentLang, selectedSite?.id, archT.viewDossier, sites]);

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
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Country Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setCountryFilter('All')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                countryFilter === 'All'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {archT.filterAll} ({sites.length})
            </button>
            <button
              onClick={() => setCountryFilter('India')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                countryFilter === 'India'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳</span> {archT.filterIndia} ({sites.filter((s) => s.country === 'India').length})
            </button>
            <button
              onClick={() => setCountryFilter('Russia')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                countryFilter === 'Russia'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇷🇺</span> {archT.filterRussia} ({sites.filter((s) => s.country === 'Russia').length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {isAdmin && (
              <button
                onClick={() => setIsAddSiteModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Site (Admin)</span>
              </button>
            )}

            {/* Search bar */}
            <div className="relative w-full sm:w-72">
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
                <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSitePhotoClick(site)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>{archT.flyToMap}</span>
                  </button>

                  <button
                    onClick={() => setDossierSite(site)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{archT.viewDossier}</span>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5 w-full pt-1 border-t border-slate-800/80">
                      <button
                        onClick={(e) => handleStartEditSite(site, e)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-colors cursor-pointer"
                        title="Edit site & photo (Admin)"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit Site</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteSite(site.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete site (Admin)"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
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
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              {isAdmin ? (
                <button
                  onClick={() => {
                    handleStartEditSite(dossierSite);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-4 py-2 text-xs font-semibold text-amber-300 cursor-pointer transition"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Site & Photo (Admin)</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDossierSite(null)}
                  className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                >
                  {archT.closeModal}
                </button>
                <button
                  onClick={() => {
                    handleSitePhotoClick(dossierSite);
                    setDossierSite(null);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                >
                  <Compass className="h-4 w-4" />
                  <span>{archT.flyToMap}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Site Modal */}
      {isAdmin && isAddSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0b101c] p-6 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="h-5 w-5 text-amber-400" />
                <span>Add Archaeological Site (Admin)</span>
              </h3>
              <button
                onClick={() => setIsAddSiteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Site Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                    placeholder="e.g. Rakhigarhi"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country *</label>
                  <select
                    value={newSiteCountry}
                    onChange={(e) => setNewSiteCountry(e.target.value as 'Russia' | 'India')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="Russia">🇷🇺 Russia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Region / Province</label>
                  <input
                    type="text"
                    value={newSiteRegion}
                    onChange={(e) => setNewSiteRegion(e.target.value)}
                    placeholder="e.g. Haryana, India"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Civilization / Culture</label>
                  <input
                    type="text"
                    value={newSiteCivilization}
                    onChange={(e) => setNewSiteCivilization(e.target.value)}
                    placeholder="e.g. Mature Harappan Phase"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age / Epoch</label>
                  <input
                    type="text"
                    value={newSiteAge}
                    onChange={(e) => setNewSiteAge(e.target.value)}
                    placeholder="e.g. c. 2600 BCE"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newSiteLat}
                    onChange={(e) => setNewSiteLat(e.target.value)}
                    placeholder="e.g. 29.28"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newSiteLng}
                    onChange={(e) => setNewSiteLng(e.target.value)}
                    placeholder="e.g. 76.11"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Excavation Description & History *</label>
                <textarea
                  required
                  rows={3}
                  value={newSiteDesc}
                  onChange={(e) => setNewSiteDesc(e.target.value)}
                  placeholder="Detail the archeological discoveries, architectural strata, and findings..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Key Relics (comma-separated)</label>
                <input
                  type="text"
                  value={newSiteArtifacts}
                  onChange={(e) => setNewSiteArtifacts(e.target.value)}
                  placeholder="Terracotta seals, Gold jewellery, Lapidary beads"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              {/* Photo Upload & URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Excavation Photo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newSiteImage}
                    onChange={(e) => setNewSiteImage(e.target.value)}
                    placeholder="https://... or upload from phone/computer"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 cursor-pointer text-xs font-semibold">
                    <Upload className="h-3.5 w-3.5 text-amber-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSiteImageUpload(file, false);
                      }}
                    />
                  </label>
                </div>
                {newSiteImage && (
                  <div className="mt-2 relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700">
                    <img src={newSiteImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSiteModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                >
                  Publish Archaeological Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Site Modal */}
      {isAdmin && editingSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0b101c] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" />
                <span>Edit Archaeological Site & Photo (Admin)</span>
              </h3>
              <button
                onClick={() => setEditingSite(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSite} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Site Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingSite.name}
                    onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Site Name (Russian)</label>
                  <input
                    type="text"
                    value={editingSite.nameRu || ''}
                    onChange={(e) => setEditingSite({ ...editingSite, nameRu: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Region / Province</label>
                  <input
                    type="text"
                    value={editingSite.region}
                    onChange={(e) => setEditingSite({ ...editingSite, region: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Civilization / Epoch</label>
                  <input
                    type="text"
                    value={editingSite.civilization}
                    onChange={(e) => setEditingSite({ ...editingSite, civilization: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age / Date</label>
                  <input
                    type="text"
                    value={editingSite.age}
                    onChange={(e) => setEditingSite({ ...editingSite, age: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingSite.lat}
                    onChange={(e) => setEditingSite({ ...editingSite, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingSite.lng}
                    onChange={(e) => setEditingSite({ ...editingSite, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={editingSite.shortDescription}
                  onChange={(e) => setEditingSite({ ...editingSite, shortDescription: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Archaeological Description *</label>
                <textarea
                  required
                  rows={4}
                  value={editingSite.description}
                  onChange={(e) => setEditingSite({ ...editingSite, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Indo-Eurasian Civilizational Connection</label>
                <textarea
                  rows={2}
                  value={editingSite.indoEurasianLink}
                  onChange={(e) => setEditingSite({ ...editingSite, indoEurasianLink: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              {/* Photo Editing & Local File Upload */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">Excavation Photo</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {editingSite.imageUrl && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 shadow">
                      <img src={editingSite.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editingSite.imageUrl}
                      onChange={(e) => setEditingSite({ ...editingSite, imageUrl: e.target.value })}
                      placeholder="Image URL (https://...)"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSiteImageUpload(file, true);
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">JPG, PNG, WebP supported</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSite(null)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                >
                  Save Archaeological Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
