// High-quality SVG-based simulated house photos with distinctive visual gradients
// allowing accurate perceptual hashing and instant offline testing.

function createFloodHouseSVG(config: {
  skyColor: string;
  wallColor: string;
  roofColor: string;
  waterLevel: number; // percentage from top (e.g. 0.6)
  waterColor: string;
  label: string;
  windowPattern: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${config.skyColor}" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
      <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${config.waterColor}" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
    </defs>
    <!-- Sky / Background -->
    <rect width="400" height="300" fill="url(#sky)" />
    
    <!-- Distant flooded trees -->
    <circle cx="60" cy="140" r="35" fill="#475569" opacity="0.4" />
    <circle cx="110" cy="135" r="45" fill="#334155" opacity="0.3" />
    <circle cx="340" cy="145" r="40" fill="#475569" opacity="0.4" />

    <!-- House Structure -->
    <!-- Walls -->
    <rect x="90" y="100" width="220" height="150" fill="${config.wallColor}" stroke="#334155" stroke-width="2" />
    
    <!-- Triangular Roof -->
    <polygon points="60,105 200,30 340,105" fill="${config.roofColor}" stroke="#1e293b" stroke-width="3" />
    
    <!-- Windows & Door -->
    ${config.windowPattern}

    <!-- High Flood Water Plane -->
    <rect x="0" y="${300 * config.waterLevel}" width="400" height="${300 * (1 - config.waterLevel)}" fill="url(#water)" opacity="0.9" />
    
    <!-- Water Ripple lines -->
    <path d="M 0,${300 * config.waterLevel + 10} Q 100,${300 * config.waterLevel + 5} 200,${300 * config.waterLevel + 10} T 400,${300 * config.waterLevel + 10}" fill="none" stroke="#94a3b8" stroke-width="2" opacity="0.6" />
    <path d="M 0,${300 * config.waterLevel + 25} Q 80,${300 * config.waterLevel + 30} 180,${300 * config.waterLevel + 25} T 400,${300 * config.waterLevel + 25}" fill="none" stroke="#64748b" stroke-width="1.5" opacity="0.5" />
    
    <!-- Flood Mark Warning Badge / Tag in photo -->
    <rect x="15" y="15" width="160" height="26" rx="4" fill="#0f172a" opacity="0.8" />
    <text x="25" y="32" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">${config.label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_HOUSE_PHOTOS = [
  {
    id: 'sample_house_1',
    name: 'Rampur Brick Dwelling (High Inundation)',
    label: 'RAMPUR-SEC2-01',
    damageLevel: 'submerged' as const,
    dataUrl: createFloodHouseSVG({
      skyColor: '#94a3b8',
      wallColor: '#b45309', // terracotta brick
      roofColor: '#78350f',
      waterLevel: 0.58, // more than halfway submerged
      waterColor: '#3b82f6',
      label: 'RAMPUR-SEC2-01',
      windowPattern: `
        <rect x="120" y="125" width="40" height="40" fill="#1e293b" />
        <rect x="240" y="125" width="40" height="40" fill="#1e293b" />
        <rect x="180" y="130" width="40" height="70" fill="#0f172a" />
      `,
    }),
  },
  {
    id: 'sample_house_2',
    name: 'Ganga Nagar Concrete Home (Severe Damage)',
    label: 'GANGA-NAGAR-04',
    damageLevel: 'severe' as const,
    dataUrl: createFloodHouseSVG({
      skyColor: '#64748b',
      wallColor: '#e2e8f0', // light grey concrete
      roofColor: '#0284c7', // blue tin roof
      waterLevel: 0.65,
      waterColor: '#0369a1',
      label: 'GANGA-NAGAR-04',
      windowPattern: `
        <rect x="110" y="120" width="55" height="50" fill="#0f172a" />
        <rect x="235" y="120" width="55" height="50" fill="#0f172a" />
      `,
    }),
  },
  {
    id: 'sample_house_3',
    name: 'Riverbank Lowland Hut (Completely Submerged)',
    label: 'RIVERBANK-B-14',
    damageLevel: 'submerged' as const,
    dataUrl: createFloodHouseSVG({
      skyColor: '#475569',
      wallColor: '#713f12', // mud/bamboo wall
      roofColor: '#451a03', // dark thatch
      waterLevel: 0.45, // deeply submerged
      waterColor: '#1e3a8a',
      label: 'RIVERBANK-B-14',
      windowPattern: `
        <rect x="175" y="110" width="50" height="60" fill="#0f172a" />
      `,
    }),
  },
  {
    id: 'sample_house_4',
    name: 'Belgachia North Plinth (Partial Flood Water)',
    label: 'BELGACHIA-N-07',
    damageLevel: 'partial' as const,
    dataUrl: createFloodHouseSVG({
      skyColor: '#cbd5e1',
      wallColor: '#fef08a', // yellow lime wash
      roofColor: '#dc2626', // red tile
      waterLevel: 0.78, // ankle/knee water
      waterColor: '#0284c7',
      label: 'BELGACHIA-N-07',
      windowPattern: `
        <rect x="115" y="120" width="40" height="40" fill="#0f172a" />
        <rect x="245" y="120" width="40" height="40" fill="#0f172a" />
        <rect x="180" y="120" width="40" height="85" fill="#334155" />
      `,
    }),
  },
];
