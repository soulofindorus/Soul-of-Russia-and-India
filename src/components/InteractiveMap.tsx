import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Region, Language } from '../types';
import { getRegionPinHtml } from '../utils/mapPin';
import { Compass, ChevronRight, Layers } from 'lucide-react';

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
  const fallbackImg = isRussia ? '/cultural_images/novgorod_kremlin.jpg' : '/cultural_images/indian_gaon.jpg';

  const getLocalizedName = (r: Region) =>
    currentLang === 'ru' ? r.nameRu || r.name : currentLang === 'hi' ? r.nameHi || r.name : r.name;

  const getLocalizedDesc = (r: Region) =>
    currentLang === 'ru'
      ? r.shortDescriptionRu || r.shortDescription
      : currentLang === 'hi'
      ? r.shortDescriptionHi || r.shortDescription
      : r.shortDescription;

  const getLocalizedSubtitle = (r: Region) =>
    currentLang === 'ru'
      ? r.subtitleRu || r.subtitle
      : currentLang === 'hi'
      ? r.subtitleHi || r.subtitle
      : r.subtitle;

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

    const defaultCenter: [number, number] = isRussia ? [59, 68] : [22.5, 81];
    const defaultZoom = isRussia ? 3 : 5;

    let map: L.Map;
    try {
      map = L.map(container, {
        center: defaultCenter,
        zoom: defaultZoom,
        minZoom: 2.5,
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
    const defaultCenter: [number, number] = isRussia ? [59, 68] : [22.5, 81];
    const defaultZoom = isRussia ? 3 : 5;
    try {
      activeMap.setView(defaultCenter, defaultZoom);
    } catch (e) {
      console.warn('Error setting view:', e);
    }
  }, [activeMap, country, isRussia]);

  // Manage Tile Layers
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
        { maxZoom: 19, attribution: '' }
      );
      const ref = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: '' }
      );
      group.addLayer(sat);
      group.addLayer(ref);
    } else {
      const darkLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19, attribution: '' }
      );
      group.addLayer(darkLayer);
    }

    tileLayerGroupRef.current = group;
  }, [activeMap, layerMode]);

  // Manage Markers (compact pins + hover tooltip to avoid 125-label overlap)
  useEffect(() => {
    if (!activeMap) return;

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
      const displayName = getLocalizedName(region);
      const displayDesc = getLocalizedDesc(region);
      const imgSrc = region.image || fallbackImg;

      const markerHtml = getRegionPinHtml(region, isSelected, displayName);

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-region-pin',
        iconSize: isSelected ? [36, 44] : [26, 32],
        iconAnchor: isSelected ? [18, 43] : [13, 31],
      });

      const marker = L.marker([region.lat, region.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(activeMap);

      marker.bindTooltip(
        `<div class="text-[11px] font-bold text-slate-900">${displayName}${
          region.capital ? ` · ${currentLang === 'ru' ? region.capitalRu || region.capital : currentLang === 'hi' ? region.capitalHi || region.capital : region.capital}` : ''
        }</div>`,
        { direction: 'top', offset: [0, -8] }
      );

      const popupHtml = `
        <div style="width: 220px;" class="text-left font-sans">
          <div class="h-24 w-full overflow-hidden rounded-md mb-2 border border-slate-700 bg-slate-900">
            <img src="${imgSrc}" referrerpolicy="no-referrer" onerror="this.src='${fallbackImg}'" alt="${displayName}" class="h-full w-full object-cover" />
          </div>
          <div class="font-bold text-xs text-amber-300 mb-0.5">${displayName}</div>
          <div class="text-[10px] text-slate-300 line-clamp-2 leading-relaxed mb-2">${displayDesc}</div>
          <button
            id="interactive-popup-btn-${region.id}"
            class="w-full rounded bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>${currentLang === 'ru' ? 'Открыть досье' : currentLang === 'hi' ? 'विवरण देखें' : 'Explore Heritage'}</span>
            <span>&rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { offset: [0, -10] });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`interactive-popup-btn-${region.id}`);
        if (btn) {
          btn.onclick = () => onSelectRegion(region);
        }
      });

      marker.on('click', () => {
        onSelectRegion(region);
      });

      markersRef.current[region.id] = marker;
    });
  }, [activeMap, regions, selectedRegionId, currentLang, onSelectRegion, isRussia, fallbackImg]);

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-[#091120] p-4 sm:p-6 shadow-2xl">
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-amber-200 block">
              {isRussia
                ? currentLang === 'ru'
                  ? `РОССИЙСКАЯ ФЕДЕРАЦИЯ · ${regions.length} РЕГИОНОВ`
                  : currentLang === 'hi'
                  ? `रूसी संघ · ${regions.length} क्षेत्र`
                  : `RUSSIAN FEDERATION · ${regions.length} REGIONS`
                : currentLang === 'ru'
                ? `РЕСПУБЛИКА ИНДИЯ · ${regions.length} ШТАТОВ И ТЕРРИТОРИЙ`
                : currentLang === 'hi'
                ? `भारतीय गणराज्य · ${regions.length} राज्य और केंद्र शासित प्रदेश`
                : `REPUBLIC OF INDIA · ${regions.length} STATES & UNION TERRITORIES`}
            </span>
            <span className="text-[11px] text-slate-400">
              {currentLang === 'ru'
                ? 'Нажмите на любую точку карты, чтобы открыть достопримечательности, факты и медиа'
                : currentLang === 'hi'
                ? 'विरासत स्थल, विशेषताएँ और तथ्य देखने के लिए मानचित्र पर किसी भी बिंदु पर क्लिक करें'
                : 'Click any pin on the map to inspect heritage sites, specific features, facts, photos & video'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1">
          <button
            onClick={() => {
              setMapMode('leaflet');
              setLayerMode('satellite');
            }}
            className={`whitespace-nowrap shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mapMode === 'leaflet' && layerMode === 'satellite'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Satellite</span>
          </button>
          <button
            onClick={() => {
              setMapMode('leaflet');
              setLayerMode('dark');
            }}
            className={`whitespace-nowrap shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mapMode === 'leaflet' && layerMode === 'dark'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Dark Atlas</span>
          </button>
          <button
            onClick={() => setMapMode('schematic')}
            className={`whitespace-nowrap shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

      {mapMode === 'leaflet' ? (
        <div className="relative mt-4 aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800 shadow-inner">
          <div
            ref={leafletContainerRef}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: '420px' }}
          />
        </div>
      ) : (
        <div className="relative mt-4 aspect-[16/9] w-full rounded-xl bg-gradient-to-b from-[#0e172a] to-[#070c18] border border-slate-800/80 shadow-inner flex items-center justify-center overflow-hidden">
          {isRussia ? (
            <svg
              viewBox="0 0 900 450"
              className="absolute inset-0 h-full w-full opacity-25 text-blue-400"
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M 120 180 C 150 140, 200 130, 250 120 C 320 110, 420 100, 520 90 C 620 90, 720 120, 810 160 C 840 180, 860 220, 830 250 C 780 280, 700 300, 620 310 C 520 320, 420 330, 320 310 C 240 290, 180 270, 140 240 Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 h-full w-full opacity-25 text-amber-500"
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M 250 50 C 290 80, 330 110, 310 160 C 370 190, 400 240, 370 280 C 340 330, 300 400, 250 460 C 200 400, 160 330, 130 280 C 100 240, 130 190, 190 160 C 170 110, 210 80, 250 50 Z" />
            </svg>
          )}

          {regions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const regionName = getLocalizedName(region);

            return (
              <div
                key={region.id}
                style={{ left: `${region.mapX}%`, top: `${region.mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20 group hover:z-40"
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onSelectRegion(region)}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: getRegionPinHtml(region, isSelected || isHovered, regionName),
                  }}
                />
              </div>
            );
          })}

          {(hoveredRegion || regions.find((r) => r.id === selectedRegionId)) && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 rounded-xl border border-amber-500/40 bg-[#090f1a]/95 p-3.5 shadow-2xl backdrop-blur-md">
              {(() => {
                const target = hoveredRegion || regions.find((r) => r.id === selectedRegionId)!;
                return (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-cinzel text-sm font-bold text-amber-300">
                          {getLocalizedName(target)}
                        </h4>
                        <p className="text-[10px] text-slate-400">{getLocalizedSubtitle(target)}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 shrink-0">
                        {target.regionType || target.country}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-serif-culture">
                      {getLocalizedDesc(target)}
                    </p>
                    <button
                      onClick={() => onSelectRegion(target)}
                      className="flex w-full items-center justify-center gap-1 rounded-lg bg-amber-500 px-2 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400 cursor-pointer"
                    >
                      <span>Open Region Dossier</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
