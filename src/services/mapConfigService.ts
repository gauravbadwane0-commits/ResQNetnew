export type MapProviderId = 'google' | 'mapbox' | 'carto_osm';

export interface MapProviderOption {
  id: MapProviderId;
  name: string;
  envVar: string;
  requiresKey: boolean;
  keyPlaceholder: string;
  keyHelpUrl: string;
  description: string;
  badge: string;
}

export const MAP_PROVIDERS: MapProviderOption[] = [
  {
    id: 'google',
    name: 'Google Maps Platform',
    envVar: 'VITE_GOOGLE_MAPS_API_KEY',
    requiresKey: true,
    keyPlaceholder: 'AIzaSy...',
    keyHelpUrl: 'https://console.cloud.google.com/google/maps-apis/',
    description: 'Official Google Maps cartography, satellite imagery, and routing infrastructure.',
    badge: 'Recommended',
  },
  {
    id: 'mapbox',
    name: 'Mapbox',
    envVar: 'VITE_MAPBOX_ACCESS_TOKEN',
    requiresKey: true,
    keyPlaceholder: 'pk.eyJ1...',
    keyHelpUrl: 'https://account.mapbox.com/access-tokens/',
    description: 'Custom high-contrast emergency dark and night navigation styles.',
    badge: 'API Key Required',
  },
  {
    id: 'carto_osm',
    name: 'OpenStreetMap / CartoDB (Free Fallback)',
    envVar: 'None',
    requiresKey: false,
    keyPlaceholder: 'No API key needed (100% Free)',
    keyHelpUrl: 'https://www.openstreetmap.org/',
    description: 'Open-source community cartography. Works out of the box with zero setup.',
    badge: 'Free / Zero Keys',
  },
];

export interface MapConfig {
  provider: MapProviderId;
  apiKey: string;
  style: 'dark' | 'satellite' | 'streets';
}

const STORAGE_KEY = 'resqnet_map_config_v3';

export const getMapConfig = (): MapConfig => {
  // 1. Read environment variables first
  const envGoogleKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string)?.trim() || '';
  const envMapboxKey = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string)?.trim() || '';
  const envProvider = (import.meta.env.VITE_MAP_PROVIDER as MapProviderId) || 'google';

  // 2. Check local storage overrides (e.g. if user pasted key in UI)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: MapConfig = JSON.parse(raw);
      // If user has an env key and saved key is empty, populate from env
      if (!parsed.apiKey) {
        if (parsed.provider === 'google' && envGoogleKey) parsed.apiKey = envGoogleKey;
        if (parsed.provider === 'mapbox' && envMapboxKey) parsed.apiKey = envMapboxKey;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed reading map config from storage:', e);
  }

  // 3. Initial state based on env
  const defaultKey = envProvider === 'mapbox' ? envMapboxKey : envGoogleKey;

  return {
    provider: envProvider,
    apiKey: defaultKey,
    style: 'dark',
  };
};

export const saveMapConfig = (config: MapConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed saving map config:', e);
  }
};

export interface TileLayerProps {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
}

export const getTileLayerProps = (config: MapConfig): TileLayerProps => {
  const { provider, apiKey, style } = config;

  // 1. Google Maps
  if (provider === 'google' && apiKey) {
    // lyrs=m: roadmap, lyrs=y: hybrid satellite, lyrs=p: terrain
    let lyrs = 'm';
    if (style === 'satellite') lyrs = 'y';
    if (style === 'streets') lyrs = 'm';

    return {
      url: `https://mt1.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${encodeURIComponent(apiKey)}`,
      attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>',
      maxZoom: 20,
    };
  }

  // 2. Mapbox
  if (provider === 'mapbox' && apiKey) {
    let mapboxStyle = 'mapbox/dark-v11';
    if (style === 'satellite') mapboxStyle = 'mapbox/satellite-streets-v12';
    if (style === 'streets') mapboxStyle = 'mapbox/navigation-night-v1';

    return {
      url: `https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${encodeURIComponent(apiKey)}`,
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; OpenStreetMap',
      maxZoom: 20,
    };
  }

  // 3. Fallback: CartoDB Dark Matter / OSM (100% Free, zero key required)
  return {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  };
};
