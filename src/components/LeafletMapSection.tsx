import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Region, Language } from '../types';
import {
  Compass,
  MapPin,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  Eye,
  Landmark,
  BookOpen,
} from 'lucide-react';

interface LeafletMapSectionProps {
  currentLang: Language;
  regions: Region[];
  onSelectRegion: (regionId: string) => void;
  onNavigate?: (section: string) => void;
}

type MapFocus = 'both' | 'Russia' | 'India';
type MapLayerMode = 'satellite' | 'satellite-clean' | 'dark';

export const LeafletMapSection: React.FC<LeafletMapSectionProps> = ({
  currentLang,
  regions,
  onSelectRegion,
  onNavigate,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeFocus, setActiveFocus] = useState<MapFocus>('both');
  const [layerMode, setLayerMode] = useState<MapLayerMode>('satellite');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [activeMap, setActiveMap] = useState<L.Map | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || null;

  // Initialize Leaflet Map (strictly attributionControl: false with no watermark or logos)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if ((container as any)._leaflet_id) {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing map instance:', e);
        }
        mapInstanceRef.current = null;
      }
      delete (container as any)._leaflet_id;
    }

    let map: L.Map;
    try {
      map = L.map(container, {
        center: [42, 62],
        zoom: 3,
        minZoom: 2.5,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: false, // Avoid trapping page scroll
        attributionControl: false, // Disables all watermarks, copyright overlays, and flags
      });
    } catch (err) {
      console.warn('Leaflet map initialization guarded:', err);
      return;
    }

    // Zoom control in top right
    try {
      L.control
        .zoom({
          position: 'topright',
        })
        .addTo(map);
    } catch (e) {
      console.warn('Error adding zoom control:', e);
    }

    mapInstanceRef.current = map;
    setActiveMap(map);

    // Resize observer to handle container size changes smoothly
    const resizeObserver = new ResizeObserver(() => {
      try {
        map.invalidateSize();
      } catch {
        // ignore
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      try {
        map.remove();
      } catch (e) {
        console.warn('Error cleaning up map:', e);
      }
      mapInstanceRef.current = null;
      setActiveMap(null);
      tileLayerGroupRef.current = null;
    };
  }, []);

  // Update Tile Layers when layerMode or map changes (Zero Watermark)
  useEffect(() => {
    if (!activeMap) return;

    if (tileLayerGroupRef.current) {
      try {
        tileLayerGroupRef.current.clearLayers();
        activeMap.removeLayer(tileLayerGroupRef.current);
      } catch (e) {
        console.warn('Error clearing tile layers:', e);
      }
    }

    const group = L.layerGroup().addTo(activeMap);

    if (layerMode === 'satellite') {
      // 1) High-resolution ESRI World Imagery (Satellite) - Completely watermark-free
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '',
        }
      );
      // 2) Clean administrative boundaries & labels (No watermark)
      const refLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '',
        }
      );
      group.addLayer(satLayer);
      group.addLayer(refLayer);
    } else if (layerMode === 'satellite-clean') {
      // Pure Raw Satellite Earth View - No labels, no watermark
      const pureSatLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '',
        }
      );
      group.addLayer(pureSatLayer);
    } else {
      // Dark Atlas CartoDB
      const darkLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19,
          attribution: '',
        }
      );
      group.addLayer(darkLayer);
    }

    tileLayerGroupRef.current = group;
  }, [layerMode, activeMap]);

  // Update Markers whenever regions or currentLang changes
  useEffect(() => {
    if (!activeMap) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => {
      try {
        m.remove();
      } catch {
        // ignore
      }
    });
    markersRef.current = {};

    regions.forEach((region) => {
      if (typeof region.lat !== 'number' || typeof region.lng !== 'number') return;

      const isRussia = region.country === 'Russia';
      const isSelected = selectedRegionId === region.id;
      const displayName =
        currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

      // Custom DivIcon with glowing badge & pin
      const markerHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125" style="transform: translate(-50%, -50%);">
          <div class="absolute -inset-2 rounded-full ${
            isSelected
              ? 'bg-amber-400/50 animate-ping'
              : isRussia
              ? 'bg-blue-500/20 group-hover:bg-blue-500/40'
              : 'bg-orange-500/20 group-hover:bg-orange-500/40'
          } transition-all"></div>
          
          <div class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
            isSelected
              ? 'border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.9)] scale-110'
              : isRussia
              ? 'border-blue-300 bg-gradient-to-tr from-blue-900 to-blue-600 text-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
              : 'border-amber-300 bg-gradient-to-tr from-orange-800 to-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
          }">
            <span class="text-[11px] font-extrabold">${isRussia ? '🇷🇺' : '🇮🇳'}</span>
          </div>

          <div class="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber-500/30 bg-[#070d19]/95 px-2 py-0.5 text-[10px] font-bold text-amber-200 shadow-xl backdrop-blur-md transition-all ${
            isSelected ? 'opacity-100 scale-100 ring-1 ring-amber-400' : 'opacity-85 scale-95'
          }">
            ${displayName}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-region-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([region.lat, region.lng], { icon: customIcon }).addTo(activeMap);

      // Bind custom styled popup
      const popupHtml = `
        <div style="width: 220px;" class="text-left font-sans">
          <div class="relative h-24 w-full overflow-hidden rounded-lg mb-2 border border-slate-700">
            <img src="${region.image}" alt="${displayName}" class="h-full w-full object-cover" />
            <div class="absolute top-1 left-1 rounded bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
              ${isRussia ? 'Russian Federation' : 'Republic of India'}
            </div>
          </div>
          <div class="font-bold text-xs text-amber-300 mb-0.5">${displayName}</div>
          <div class="text-[10px] text-slate-300 line-clamp-2 leading-relaxed mb-2">${region.shortDescription}</div>
          <button
            id="popup-btn-${region.id}"
            class="w-full rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 text-[10px] font-extrabold tracking-wide uppercase shadow transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore Region Dossier</span>
            <span>&rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -12],
        closeButton: true,
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${region.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectRegion(region.id);
          };
        }
      });

      marker.on('click', () => {
        setSelectedRegionId(region.id);
        activeMap.flyTo([region.lat!, region.lng!], Math.max(activeMap.getZoom(), 5), {
          duration: 1.2,
        });
      });

      markersRef.current[region.id] = marker;
    });
  }, [regions, currentLang, selectedRegionId, activeMap, onSelectRegion]);

  // Focus and FlyTo changes
  const handleFocusChange = (focus: MapFocus) => {
    setActiveFocus(focus);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focus === 'both') {
      map.flyTo([42, 62], 3, { duration: 1.2 });
    } else if (focus === 'Russia') {
      map.flyTo([57, 50], 4, { duration: 1.2 });
    } else if (focus === 'India') {
      map.flyTo([23, 80], 5, { duration: 1.2 });
    }
  };

  const handleSelectRegionCard = (region: Region) => {
    setSelectedRegionId(region.id);
    const map = mapInstanceRef.current;
    if (map && typeof region.lat === 'number' && typeof region.lng === 'number') {
      map.flyTo([region.lat, region.lng], 6, { duration: 1.2 });
      const marker = markersRef.current[region.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const filteredRegions =
    activeFocus === 'both'
      ? regions
      : regions.filter((r) => r.country === activeFocus);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Header with Artistic Accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/90 pb-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-3.5 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider shadow-sm">
            <Compass className="h-3.5 w-3.5 text-amber-600" />
            <span>Interactive Cartography • Интерактивная Карта • इंटरेक्टिव मानचित्र</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-wide">
            Eurasian Civilizational Landscape
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-serif-culture leading-relaxed">
            Directly navigate and explore the historical cradles, archaeological sanctuaries, and living traditions of both nations. Click any pin on the map to open the full regional dossier.
          </p>
        </div>

        {/* View Focus Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-slate-200/90 shadow-md w-full sm:w-auto">
          <button
            onClick={() => handleFocusChange('both')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none ${
              activeFocus === 'both'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Corridor (Both)</span>
          </button>
          <button
            onClick={() => handleFocusChange('Russia')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none ${
              activeFocus === 'Russia'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>🇷🇺</span>
            <span>Russia ({regions.filter((r) => r.country === 'Russia').length})</span>
          </button>
          <button
            onClick={() => handleFocusChange('India')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none ${
              activeFocus === 'India'
                ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>🇮🇳</span>
            <span>India ({regions.filter((r) => r.country === 'India').length})</span>
          </button>
        </div>
      </div>

      {/* Main Map Box with Interactive Overlay */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#070c18] shadow-2xl">
        {/* Top Floating Legend & Info Bar with Satellite/Layer Switcher */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-16 z-[1000] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2">
            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#080f1e]/90 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-md shadow-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 ring-2 ring-blue-500/40" />
              <span className="font-semibold">Russian Regions</span>
              <span className="text-slate-500">•</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-orange-400 ring-2 ring-orange-500/40" />
              <span className="font-semibold">Indian Regions</span>
            </div>

            <div className="hidden lg:flex pointer-events-auto items-center gap-1 rounded-xl border border-amber-500/30 bg-[#080f1e]/90 px-3 py-1.5 text-[11px] text-amber-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              <span>13 Historical Landscapes Mapped</span>
            </div>
          </div>

          {/* Map Layer Mode Switcher: Satellite / Pure Earth / Dark Atlas */}
          <div className="pointer-events-auto flex items-center gap-1 bg-[#080f1e]/95 p-1 rounded-xl border border-amber-500/30 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setLayerMode('satellite')}
              title="Satellite map with geographical borders and labels (Zero Watermark)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                layerMode === 'satellite'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🛰️</span>
              <span className="hidden sm:inline">Satellite Hybrid</span>
              <span className="sm:hidden">Satellite</span>
            </button>
            <button
              onClick={() => setLayerMode('satellite-clean')}
              title="Pure Satellite Photography without labels (Zero Watermark)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                layerMode === 'satellite-clean'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🌍</span>
              <span className="hidden sm:inline">Pure Satellite</span>
              <span className="sm:hidden">Pure</span>
            </button>
            <button
              onClick={() => setLayerMode('dark')}
              title="Dark Cartographic Night Atlas"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                layerMode === 'dark'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🌙</span>
              <span className="hidden sm:inline">Dark Atlas</span>
              <span className="sm:hidden">Dark</span>
            </button>
          </div>
        </div>

        {/* The Leaflet Canvas Container */}
        <div
          ref={mapContainerRef}
          className="h-[420px] sm:h-[520px] w-full cursor-grab active:cursor-grabbing"
          style={{ minHeight: '400px' }}
        />

        {/* Selected Region Floating Card overlay on map */}
        {selectedRegion && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-[1000] rounded-2xl border border-amber-500/50 bg-[#080f20]/95 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <img
                  src={selectedRegion.image}
                  alt={selectedRegion.name}
                  className="h-16 w-16 rounded-xl object-cover border border-amber-400/40 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                      {selectedRegion.country === 'Russia' ? '🇷🇺 Russia' : '🇮🇳 India'}
                    </span>
                    {selectedRegion.archaeologicalInfo && (
                      <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                        Archaeology
                      </span>
                    )}
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-white">
                    {currentLang === 'ru'
                      ? selectedRegion.nameRu
                      : currentLang === 'hi'
                      ? selectedRegion.nameHi
                      : selectedRegion.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-serif-culture">
                    {selectedRegion.shortDescription}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRegionId(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-amber-300/80 font-mono">
                {selectedRegion.lat?.toFixed(2)}°N, {selectedRegion.lng?.toFixed(2)}°E
              </span>
              <button
                onClick={() => onSelectRegion(selectedRegion.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow hover:scale-105 transition-all"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Open Heritage Dossier</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Region Selector Grid below Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-2">
            <Landmark className="h-3.5 w-3.5" />
            <span>Click any region below to fly the map & examine:</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('heritage')}
              className="text-xs text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1"
            >
              <span>View full archaeology catalog</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredRegions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isRussia = region.country === 'Russia';
            const name =
              currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;
            const fullTitle = `${name}${region.subtitle ? ` — ${region.subtitle}` : ''}`;

            return (
              <button
                key={region.id}
                onClick={() => handleSelectRegionCard(region)}
                title={fullTitle}
                className={`group relative flex flex-col h-24 sm:h-28 w-full overflow-hidden rounded-xl border text-left transition-all duration-200 focus:outline-none ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_18px_rgba(212,175,55,0.4)]'
                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-lg'
                }`}
              >
                {/* Background Image of the Box */}
                <img
                  src={region.image}
                  alt={region.name}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Dark gradient scrim to guarantee text legibility inside the image box */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/65 to-black/30 group-hover:via-[#060a14]/50 transition-colors" />

                {/* Country Badge inside the box at top-left */}
                <div className="relative z-10 p-2 flex items-center justify-between">
                  <span className="rounded bg-black/75 px-1.5 py-0.5 text-[8px] font-extrabold text-white border border-white/10 backdrop-blur-sm">
                    {isRussia ? '🇷🇺 RU' : '🇮🇳 IN'}
                  </span>
                  {region.archaeologicalInfo && (
                    <span className="rounded bg-amber-500/30 px-1 py-0.2 text-[8px] font-bold text-amber-200 backdrop-blur-sm">
                      Site
                    </span>
                  )}
                </div>

                {/* Text placed inside the box of image at the bottom */}
                <div className="relative z-10 mt-auto p-2 pt-0 flex flex-col min-w-0 w-full">
                  <span className="font-cinzel text-[11px] sm:text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate drop-shadow-md">
                    {name}
                  </span>
                  <span className="text-[9px] text-amber-200/80 truncate drop-shadow-sm">
                    {region.subtitle || region.country}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
