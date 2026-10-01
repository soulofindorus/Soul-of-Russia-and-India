import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Region, Language } from '../types';
import { MapPin, Sparkles, Compass, ChevronRight, Eye, Film, Layers, Globe } from 'lucide-react';

interface InteractiveMapProps {
  country: 'Russia' | 'India';
  regions: Region[];
  selectedRegionId: string | null;
  onSelectRegion: (region: Region) => void;
  currentLang: Language;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  country,
  regions,
  selectedRegionId,
  onSelectRegion,
  currentLang,
}) => {
  const [mapMode, setMapMode] = useState<'leaflet' | 'schematic'>('leaflet');
  const [layerMode, setLayerMode] = useState<'satellite' | 'dark'>('satellite');
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [activeMap, setActiveMap] = useState<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const isRussia = country === 'Russia';

  // Initialize Leaflet instance safely
  useEffect(() => {
    if (mapMode !== 'leaflet') {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {
          console.warn('Error removing map instance:', e);
        }
        leafletMapRef.current = null;
        setActiveMap(null);
        tileLayerGroupRef.current = null;
      }
      return;
    }

    const container = leafletContainerRef.current;
    if (!container) return;

    // Guard against stale Leaflet container initialization
    if ((container as any)._leaflet_id) {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {
          console.warn('Error removing existing map:', e);
        }
        leafletMapRef.current = null;
      }
      delete (container as any)._leaflet_id;
    }

    const defaultCenter: [number, number] = isRussia ? [57, 50] : [23, 80];
    const defaultZoom = isRussia ? 4 : 5;

    let map: L.Map;
    try {
      map = L.map(container, {
        center: defaultCenter,
        zoom: defaultZoom,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });
    } catch (err) {
      console.warn('Leaflet map initialization guarded in InteractiveMap:', err);
      return;
    }

    leafletMapRef.current = map;
    setActiveMap(map);

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
        console.warn('Error on map cleanup:', e);
      }
      leafletMapRef.current = null;
      setActiveMap(null);
      tileLayerGroupRef.current = null;
    };
  }, [mapMode]);

  // Update center & zoom when country changes
  useEffect(() => {
    if (!activeMap) return;
    const defaultCenter: [number, number] = isRussia ? [57, 50] : [23, 80];
    const defaultZoom = isRussia ? 4 : 5;
    try {
      activeMap.setView(defaultCenter, defaultZoom);
    } catch (e) {
      console.warn('Error setting view:', e);
    }
  }, [activeMap, country, isRussia]);

  // Manage Tile Layers with ESRI Satellite (No Watermark)
  useEffect(() => {
    if (!activeMap) return;

    if (tileLayerGroupRef.current) {
      try {
        tileLayerGroupRef.current.clearLayers();
        activeMap.removeLayer(tileLayerGroupRef.current);
      } catch (e) {
        console.warn('Error clearing tile layer group:', e);
      }
    }

    const group = L.layerGroup().addTo(activeMap);

    if (layerMode === 'satellite') {
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '',
        }
      );
      const ref = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '',
        }
      );
      group.addLayer(sat);
      group.addLayer(ref);
    } else {
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
  }, [activeMap, layerMode]);

  // Manage Markers
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

      const isSelected = selectedRegionId === region.id;
      const displayName =
        currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125" style="transform: translate(-50%, -50%);">
          <div class="absolute -inset-2 rounded-full ${
            isSelected ? 'bg-amber-400/50 animate-ping' : isRussia ? 'bg-blue-500/20' : 'bg-orange-500/20'
          }"></div>
          <div class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
            isSelected
              ? 'border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.9)] scale-110'
              : isRussia
              ? 'border-blue-300 bg-gradient-to-tr from-blue-900 to-blue-600 text-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
              : 'border-amber-300 bg-gradient-to-tr from-orange-800 to-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
          }">
            <span class="text-[11px] font-extrabold">${isRussia ? '🇷🇺' : '🇮🇳'}</span>
          </div>
          <div class="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber-500/30 bg-[#070d19]/95 px-2 py-0.5 text-[10px] font-bold text-amber-200 shadow-xl backdrop-blur-md ${
            isSelected ? 'opacity-100 scale-100 ring-1 ring-amber-400' : 'opacity-85'
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

      const popupHtml = `
        <div style="width: 200px;" class="text-left font-sans">
          <div class="h-20 w-full overflow-hidden rounded-md mb-2 border border-slate-700">
            <img src="${region.image}" alt="${displayName}" class="h-full w-full object-cover" />
          </div>
          <div class="font-bold text-xs text-amber-300 mb-0.5">${displayName}</div>
          <div class="text-[10px] text-slate-300 line-clamp-2 leading-relaxed mb-2">${region.shortDescription}</div>
          <button
            id="interactive-popup-btn-${region.id}"
            class="w-full rounded bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore Heritage</span>
            <span>&rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -12],
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`interactive-popup-btn-${region.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectRegion(region);
          };
        }
      });

      marker.on('click', () => {
        onSelectRegion(region);
      });

      markersRef.current[region.id] = marker;
    });
  }, [activeMap, regions, selectedRegionId, currentLang, onSelectRegion, isRussia]);

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-[#091120] p-4 sm:p-8 shadow-2xl">
        {/* Subtle background compass / grid lines */}
        <div className="absolute inset-0 bg-ornament-pattern opacity-40 pointer-events-none" />

        {/* Map Header bar inside container */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-cinzel text-sm font-bold tracking-wider text-amber-200">
              {isRussia ? 'EURASIAN REALM • RUSSIAN FEDERATION' : 'BHARAT • INDIAN SUBCONTINENT'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode & Map Layer Toggle */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1">
              <button
                onClick={() => {
                  setMapMode('leaflet');
                  setLayerMode('satellite');
                }}
                title="High-resolution ESRI Satellite Imagery with zero watermarks"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  mapMode === 'leaflet' && layerMode === 'satellite'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🛰️</span>
                <span>Satellite Map</span>
              </button>
              <button
                onClick={() => {
                  setMapMode('leaflet');
                  setLayerMode('dark');
                }}
                title="Dark Cartographic Map"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  mapMode === 'leaflet' && layerMode === 'dark'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌙</span>
                <span>Dark Atlas</span>
              </button>
              <button
                onClick={() => setMapMode('schematic')}
                title="Stylized Historical Realm Silhouette"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  mapMode === 'schematic'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Silhouette</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Render Mode */}
        {mapMode === 'leaflet' ? (
          <div className="relative my-4 aspect-[16/9] w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <div
              ref={leafletContainerRef}
              className="h-full w-full cursor-grab active:cursor-grabbing"
              style={{ minHeight: '380px' }}
            />
          </div>
        ) : (
          /* SVG Canvas with Country Outlines & Interactive Hotspots */
          <div className="relative my-4 aspect-[16/9] w-full max-w-4xl mx-auto rounded-xl bg-gradient-to-b from-[#0e172a] to-[#070c18] border border-slate-800/80 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Decorative Vector Silhouette */}
            {isRussia ? (
              <svg
                viewBox="0 0 900 450"
                className="absolute inset-0 h-full w-full opacity-25 text-blue-400"
                fill="currentColor"
                preserveAspectRatio="xMidYMid meet"
              >
                <path d="M 120 180 C 150 140, 200 130, 250 120 C 320 110, 420 100, 520 90 C 620 90, 720 120, 810 160 C 840 180, 860 220, 830 250 C 780 280, 700 300, 620 310 C 520 320, 420 330, 320 310 C 240 290, 180 270, 140 240 Z" />
                <ellipse cx="648" cy="270" rx="30" ry="12" className="text-cyan-300/40" />
                <line x1="380" y1="120" x2="410" y2="300" stroke="rgba(212,175,55,0.3)" strokeDasharray="4 4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 500 500"
                className="absolute inset-0 h-full w-full opacity-25 text-amber-500"
                fill="currentColor"
                preserveAspectRatio="xMidYMid meet"
              >
                <path d="M 250 50 C 290 80, 330 110, 310 160 C 370 190, 400 240, 370 280 C 340 330, 300 400, 250 460 C 200 400, 160 330, 130 280 C 100 240, 130 190, 190 160 C 170 110, 210 80, 250 50 Z" />
                <path d="M 220 170 Q 280 190 350 240" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="2" />
              </svg>
            )}

            {/* Interactive Geographic Pins */}
            {regions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const isHovered = hoveredRegion?.id === region.id;
              const regionName =
                currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

              return (
                <div
                  key={region.id}
                  style={{
                    left: `${region.mapX}%`,
                    top: `${region.mapY}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onSelectRegion(region)}
                >
                  <div
                    className={`absolute -inset-2 rounded-full transition-opacity ${
                      isSelected
                        ? 'bg-amber-400/40 animate-ping opacity-100'
                        : isHovered
                        ? 'bg-amber-500/25 opacity-100'
                        : 'opacity-0'
                    }`}
                  />

                  <div
                    className={`relative flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-125 ${
                      isSelected
                        ? 'h-8 w-8 bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.8)]'
                        : isRussia
                        ? 'h-6 w-6 bg-blue-600/90 text-white border-2 border-blue-300 shadow-md'
                        : 'h-6 w-6 bg-orange-600/90 text-white border-2 border-amber-300 shadow-md'
                    }`}
                  >
                    <MapPin className={`${isSelected ? 'h-4 w-4' : 'h-3 w-3'}`} />
                  </div>

                  <div
                    className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-amber-500/30 bg-[#090f1a]/95 px-2.5 py-1 text-xs font-semibold shadow-xl backdrop-blur-md transition-all duration-150 ${
                      isSelected || isHovered
                        ? 'opacity-100 scale-100'
                        : 'opacity-80 scale-95 sm:opacity-90'
                    }`}
                  >
                    <span className="text-amber-200">{regionName}</span>
                    {region.archaeologicalInfo && (
                      <span className="ml-1.5 rounded bg-amber-500/20 px-1 py-0.2 text-[9px] text-amber-300 font-normal">
                        Archaeology
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Active Hover / Selected Quick Info Card at bottom corner of map */}
            {(hoveredRegion || regions.find((r) => r.id === selectedRegionId)) && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 rounded-xl border border-amber-500/40 bg-[#090f1a]/95 p-3.5 shadow-2xl backdrop-blur-md">
                {(() => {
                  const target = hoveredRegion || regions.find((r) => r.id === selectedRegionId)!;
                  const name =
                    currentLang === 'ru' ? target.nameRu : currentLang === 'hi' ? target.nameHi : target.name;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-cinzel text-sm font-bold text-amber-300">{name}</h4>
                          <p className="text-[10px] text-slate-400">{target.subtitle}</p>
                        </div>
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          {target.country}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-serif-culture">
                        {target.shortDescription}
                      </p>
                      <button
                        onClick={() => onSelectRegion(target)}
                        className="flex w-full items-center justify-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                      >
                        <span>Open Complete Region Dossier</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Region Cards Grid below Map */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-400/90">
              {isRussia ? 'Selected Russian Federation Regions' : 'Selected Indian Subcontinent Regions'}
            </h4>
            <span className="text-[11px] text-slate-400">
              {regions.length} Historical Landscapes Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const name =
                currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

              return (
                <button
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-850'
                  }`}
                >
                  <img
                    src={region.image}
                    alt={region.name}
                    className="h-16 w-16 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-cinzel text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                        {name}
                      </h4>
                      {region.archaeologicalInfo && (
                        <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] text-amber-300">
                          Archaeology
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {region.shortDescription}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-400 font-semibold">
                      <Eye className="h-3 w-3" />
                      <span>Explore Heritage</span>
                      {region.videoUrl && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Film className="h-3 w-3 text-amber-400" /> Video
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
