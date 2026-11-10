import { Region } from '../types';

function getEmblemSvgPath(region: Region, strokeColor: string): string {
  const hasUnesco = Boolean(region.unescoSites && region.unescoSites.length > 0);
  const type = region.regionType || '';

  // 1. Capital / Federal City: Imperial Crown / Citadel Emblem
  if (type === 'Federal City' || region.id === 'in-ut-delhi') {
    return `
      <path d="M9 17h10l1-6-3.5 2.5L14 9l-2.5 4.5L8 11l1 6z" fill="${strokeColor}" />
      <rect x="9" y="18" width="10" height="1.5" rx="0.75" fill="${strokeColor}" />
    `;
  }

  // 2. UNESCO World Heritage Region: Golden Laurel & Star Emblem
  if (hasUnesco) {
    return `
      <path d="M14 8.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4L14 8.5z" fill="${strokeColor}" />
      <path d="M8.5 13.5c0 3.2 2.4 5.5 5.5 5.5s5.5-2.3 5.5-5.5" fill="none" stroke="${strokeColor}" stroke-width="1.3" stroke-linecap="round" />
    `;
  }

  // 3. Republic: 8-Pointed Eurasian Sunburst / Star Emblem
  if (type === 'Republic') {
    return `
      <path d="M14 8v11M8.5 13.5h11M10.1 9.6l7.8 7.8M17.9 9.6l-7.8 7.8" stroke="${strokeColor}" stroke-width="1.4" stroke-linecap="round" />
      <circle cx="14" cy="13.5" r="2.2" fill="${strokeColor}" />
    `;
  }

  // 4. Krai: Alpine / Twin-Peak Emblem
  if (type === 'Krai') {
    return `
      <path d="M8 17.5l4-6.5 2.5 3.8 1.8-2.5 3.7 5.2H8z" fill="${strokeColor}" />
    `;
  }

  // 5. Autonomous Okrug / Autonomous Oblast: Polar Compass Rose
  if (type === 'Autonomous Okrug' || type === 'Autonomous Oblast') {
    return `
      <path d="M14 7.8l1.6 4.1 4.1 1.6-4.1 1.6-1.6 4.1-1.6-4.1-4.1-1.6 4.1-1.6L14 7.8z" fill="${strokeColor}" />
    `;
  }

  // 6. Union Territory: Maritime Chakra / Wheel Emblem
  if (type === 'Union Territory') {
    return `
      <circle cx="14" cy="13.5" r="4.5" fill="none" stroke="${strokeColor}" stroke-width="1.4" />
      <circle cx="14" cy="13.5" r="1.4" fill="${strokeColor}" />
      <path d="M14 9v9M9.5 13.5h9" stroke="${strokeColor}" stroke-width="1.1" />
    `;
  }

  // 7. Default (Oblast / State): Heritage Dome & Arch Emblem
  return `
    <path d="M14 8.2c-2.6 1.8-4 4-4 6.3v3.5h8v-3.5c0-2.3-1.4-4.5-4-6.3z" fill="none" stroke="${strokeColor}" stroke-width="1.5" />
    <path d="M14 7v1.5M12 18v-2.5a2 2 0 014 0V18" stroke="${strokeColor}" stroke-width="1.3" stroke-linecap="round" />
  `;
}

export function getRegionPinHtml(
  region: Region,
  isSelected: boolean,
  displayName: string
): string {
  const isRussia = region.country === 'Russia';
  const width = isSelected ? 36 : 26;
  const height = isSelected ? 44 : 32;

  const gradId = `pin-grad-${region.id}-${isSelected ? 'sel' : 'def'}`;
  const fillStart = isSelected ? '#fcd34d' : isRussia ? '#2563eb' : '#f97316';
  const fillEnd = isSelected ? '#b45309' : isRussia ? '#1e3a8a' : '#9a3412';
  const borderColor = isSelected ? '#fef08a' : '#fbbf24';
  const emblemColor = isSelected ? '#0f172a' : '#fef3c7';

  return `
    <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-150 hover:scale-125" style="width:${width}px;height:${height}px;">
      ${
        isSelected
          ? `<div class="absolute inset-0 -m-1.5 rounded-full bg-amber-400/40 animate-ping pointer-events-none"></div>`
          : ''
      }
      <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 28 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55));"
      >
        <defs>
          <linearGradient id="${gradId}" x1="14" y1="2" x2="14" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${fillStart}" />
            <stop offset="100%" stop-color="${fillEnd}" />
          </linearGradient>
        </defs>
        <!-- Outer Heritage Crest Teardrop -->
        <path
          d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14C1.5 22.6 14 32.5 14 32.5C14 32.5 26.5 22.6 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z"
          fill="url(#${gradId})"
          stroke="${borderColor}"
          stroke-width="1.6"
        />
        <!-- Inner Medallion Ring -->
        <circle
          cx="14"
          cy="13.5"
          r="9"
          fill="rgba(7, 13, 25, 0.25)"
          stroke="rgba(253, 230, 138, 0.55)"
          stroke-width="0.9"
        />
        <!-- Regional Emblem -->
        ${getEmblemSvgPath(region, emblemColor)}
      </svg>
      ${
        isSelected
          ? `<div class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber-400 bg-[#070d19]/95 px-2 py-0.5 text-[10px] font-bold text-amber-200 shadow-xl">${displayName}</div>`
          : ''
      }
    </div>
  `;
}
