import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Facility, RoadHazard } from '../../types/emergency';
import { useLocation } from '../../context/LocationContext';
import { fetchHealthcareFacilities } from '../../services/overpassService';
import { fetchRouteDirections, RouteResult } from '../../services/osrmRoutingService';
import { formatDistance } from '../../utils/geoDistance';
import {
  getMapConfig,
  getTileLayerProps,
  MapConfig,
  MAP_PROVIDERS,
} from '../../services/mapConfigService';
import { MapSettingsModal } from './MapSettingsModal';
import {
  Navigation,
  Phone,
  Compass,
  RefreshCw,
  X,
  Key,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface EmergencyMapProps {
  roadHazards?: RoadHazard[];
  selectedFacilityForRoute?: Facility | null;
  onClearSelectedFacility?: () => void;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  roadHazards = [],
  selectedFacilityForRoute = null,
  onClearSelectedFacility,
}) => {
  const { location } = useLocation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingPOIs, setLoadingPOIs] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hospital' | 'clinic' | 'shelter' | 'hazard'>('all');
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [routeDestFacility, setRouteDestFacility] = useState<Facility | null>(null);

  // Map API & Provider Config
  const [mapConfig, setMapConfig] = useState<MapConfig>(() => getMapConfig());
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Check if API key is missing
  const isKeyMissing =
    (mapConfig.provider === 'google' || mapConfig.provider === 'mapbox') &&
    !mapConfig.apiKey;

  // SVG Custom Marker Generator
  const createCustomIcon = (
    type: 'user' | 'hospital' | 'clinic' | 'shelter' | 'hazard',
    title: string
  ) => {
    let html = '';

    if (type === 'user') {
      html = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      `;
    } else if (type === 'hospital') {
      html = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 border-2 border-white shadow-xl flex items-center justify-center shadow-red-500/50">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
        </div>
      `;
    } else if (type === 'clinic') {
      html = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 border-2 border-white shadow-xl flex items-center justify-center shadow-cyan-500/40">
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
          </div>
        </div>
      `;
    } else if (type === 'shelter') {
      html = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 border-2 border-white shadow-xl flex items-center justify-center shadow-emerald-500/40">
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V7l9-4 9 4v12a2 2 0 0 1-2 2z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          </div>
        </div>
      `;
    } else {
      // Hazard / Roadblock
      html = `
        <div class="relative flex items-center justify-center group cursor-pointer animate-bounce">
          <div class="w-7 h-7 rounded-xl bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center shadow-amber-500/50">
            <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
      `;
    }

    return L.divIcon({
      className: 'custom-div-icon',
      html,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  // Mount or Update Tile Layer according to Map API Config
  const applyTileLayer = useCallback((cfg: MapConfig) => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileProps = getTileLayerProps(cfg);
    const newLayer = L.tileLayer(tileProps.url, {
      attribution: tileProps.attribution,
      maxZoom: tileProps.maxZoom,
      subdomains: tileProps.subdomains || 'abcd',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 13,
        zoomControl: false,
      });

      // Add Zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Apply tile layer
      applyTileLayer(mapConfig);
    } else {
      mapInstanceRef.current.setView([location.lat, location.lng], mapInstanceRef.current.getZoom());
    }
  }, [applyTileLayer, location.lat, location.lng, mapConfig]);

  // Handle map config changes
  const handleConfigChanged = (newConfig: MapConfig) => {
    setMapConfig(newConfig);
    applyTileLayer(newConfig);
  };

  // Sync user location changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([location.lat, location.lng]);
    }
  }, [location.lat, location.lng]);

  // Load POIs
  const loadPOIs = async () => {
    setLoadingPOIs(true);
    try {
      const data = await fetchHealthcareFacilities(location.lat, location.lng);
      setFacilities(data);
    } catch (err) {
      console.warn('Failed loading facilities:', err);
    } finally {
      setLoadingPOIs(false);
    }
  };

  useEffect(() => {
    loadPOIs();
  }, [location.lat, location.lng]);

  // Request directions
  const handleRouteToFacility = async (facility: Facility) => {
    setRouteDestFacility(facility);
    const result = await fetchRouteDirections(
      location.lat,
      location.lng,
      facility.lat,
      facility.lng
    );
    setActiveRoute(result);

    if (mapInstanceRef.current) {
      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }

      // Draw high-visibility emergency polyline
      const polyline = L.polyline(result.coordinates, {
        color: '#06B6D4',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  };

  const handleClearRoute = () => {
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setActiveRoute(null);
    setRouteDestFacility(null);
    if (onClearSelectedFacility) onClearSelectedFacility();
  };

  useEffect(() => {
    if (selectedFacilityForRoute) {
      handleRouteToFacility(selectedFacilityForRoute);
    }
  }, [selectedFacilityForRoute]);

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const group = markersLayerRef.current;
    group.clearLayers();

    // 1. User Location Pin
    const userMarker = L.marker([location.lat, location.lng], {
      icon: createCustomIcon('user', 'You are here'),
      zIndexOffset: 1000,
    });
    userMarker.bindPopup(`
      <div class="p-2 text-xs">
        <div class="font-black text-blue-400">YOUR CURRENT LOCATION</div>
        <div class="text-[11px] text-slate-300 mt-1">${location.cityName}</div>
        <div class="text-[10px] text-slate-400 font-mono mt-0.5">${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</div>
      </div>
    `);
    group.addLayer(userMarker);

    // 2. Healthcare Facilities
    facilities.forEach((f) => {
      if (activeFilter !== 'all' && activeFilter !== f.type) return;

      const marker = L.marker([f.lat, f.lng], {
        icon: createCustomIcon(f.type, f.name),
      });

      const typeLabel =
        f.type === 'hospital'
          ? '🏥 Emergency Hospital (24x7)'
          : f.type === 'clinic'
          ? '🩺 Primary Clinic & PHC'
          : '⛺ Disaster Relief Shelter';

      const typeColor =
        f.type === 'hospital'
          ? 'text-red-400'
          : f.type === 'clinic'
          ? 'text-cyan-400'
          : 'text-emerald-400';

      const popupContent = `
        <div class="p-2 space-y-2 min-w-[210px] text-xs">
          <div class="font-extrabold ${typeColor} text-[11px] uppercase tracking-wider">${typeLabel}</div>
          <div class="font-bold text-white text-sm leading-tight">${f.name}</div>
          <div class="text-[11px] text-slate-300 leading-snug">${f.address}</div>
          <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700">
            <span class="text-slate-400">Distance:</span>
            <span class="font-bold text-white">${formatDistance(f.distanceKm)}</span>
          </div>
          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <a href="tel:${f.phone || '108'}" class="px-2 py-1.5 rounded-lg bg-red-600 text-white font-bold text-center block text-[11px]">
              Call
            </a>
            <button id="route-btn-${f.id}" class="px-2 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-center block text-[11px]">
              Route
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`route-btn-${f.id}`);
        if (btn) {
          btn.onclick = () => {
            handleRouteToFacility(f);
            marker.closePopup();
          };
        }
      });

      group.addLayer(marker);
    });

    // 3. Flood Risk Circles on Vulnerable Basins
    if (activeFilter === 'all' || activeFilter === 'hazard') {
      const floodCircle = L.circle([location.lat, location.lng], {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.12,
        radius: 2200,
        weight: 1.5,
        dashArray: '6, 6',
      });
      floodCircle.bindPopup(`
        <div class="p-2 text-xs">
          <div class="font-bold text-red-400">🌊 CLIMATE HAZARD VULNERABILITY ZONE</div>
          <div class="text-[11px] text-slate-300 mt-1">2.2km radius heavy precipitation basin. Waterlogging watch active.</div>
        </div>
      `);
      group.addLayer(floodCircle);
    }

    // 4. Community Roadblocks
    if (activeFilter === 'all' || activeFilter === 'hazard') {
      roadHazards.forEach((hazard) => {
        const hMarker = L.marker([hazard.location.lat, hazard.location.lng], {
          icon: createCustomIcon('hazard', hazard.title),
        });

        hMarker.bindPopup(`
          <div class="p-2 space-y-1.5 min-w-[200px] text-xs">
            <div class="font-black text-amber-400 uppercase text-[11px]">⚠️ ROAD HAZARD REPORT</div>
            <div class="font-bold text-white">${hazard.title}</div>
            <div class="text-[11px] text-slate-300">${hazard.description}</div>
            <div class="text-[10px] text-slate-400 mt-1">${hazard.location.address}</div>
            <div class="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded inline-block mt-1">
              Confirmed by ${hazard.confirmations} commuters
            </div>
          </div>
        `);

        group.addLayer(hMarker);
      });
    }
  }, [facilities, roadHazards, activeFilter, location.lat, location.lng]);

  const centerOnUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.lat, location.lng], 14, { animate: true });
    }
  };

  const activeProviderInfo =
    MAP_PROVIDERS.find((p) => p.id === mapConfig.provider) || MAP_PROVIDERS[0];

  return (
    <div className="relative w-full h-[calc(100vh-160px)] min-h-[460px] rounded-3xl overflow-hidden border border-navy-700 shadow-2xl">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Missing API Key Warning Overlay (Clean error state instead of broken map) */}
      {isKeyMissing && (
        <div className="absolute inset-0 z-30 bg-navy-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
            <AlertTriangle className="w-7 h-7 animate-bounce" />
          </div>

          <h3 className="text-base font-black text-white tracking-wide">
            {mapConfig.provider === 'google' ? 'Google Maps' : 'Mapbox'} API Key Required
          </h3>

          <p className="text-xs text-slate-300 mt-1.5 max-w-xs leading-relaxed">
            No API key was detected in your <code className="text-amber-300 bg-navy-900 px-1 py-0.5 rounded border border-navy-700 font-mono">.env</code> file.
          </p>

          <div className="my-3 p-3 rounded-xl bg-navy-900 border border-navy-700 text-left text-[11px] font-mono text-slate-300 w-full max-w-xs space-y-1">
            <div className="text-slate-400 font-sans font-bold text-[10px] uppercase">
              Step: Add key to .env file
            </div>
            <div className="text-amber-300 truncate font-semibold">
              {mapConfig.provider === 'google' ? 'VITE_GOOGLE_MAPS_API_KEY' : 'VITE_MAPBOX_ACCESS_TOKEN'}=YOUR_KEY
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2 pt-1">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Paste API Key in App</span>
            </button>

            <button
              onClick={() => handleConfigChanged({ ...mapConfig, provider: 'carto_osm' })}
              className="w-full py-2.5 px-3 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Use Free OpenStreetMap Fallback</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Floating Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md shadow-lg ${
            activeFilter === 'all'
              ? 'bg-red-600 text-white shadow-red-600/40'
              : 'bg-navy-900/90 text-slate-300 border border-navy-700 hover:bg-navy-800'
          }`}
        >
          All Pins ({facilities.length + roadHazards.length})
        </button>

        <button
          onClick={() => setActiveFilter('hospital')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md shadow-lg ${
            activeFilter === 'hospital'
              ? 'bg-rose-600 text-white shadow-rose-600/40'
              : 'bg-navy-900/90 text-slate-300 border border-navy-700 hover:bg-navy-800'
          }`}
        >
          🏥 Hospitals
        </button>

        <button
          onClick={() => setActiveFilter('clinic')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md shadow-lg ${
            activeFilter === 'clinic'
              ? 'bg-cyan-600 text-white shadow-cyan-600/40'
              : 'bg-navy-900/90 text-slate-300 border border-navy-700 hover:bg-navy-800'
          }`}
        >
          🩺 Clinics
        </button>

        <button
          onClick={() => setActiveFilter('shelter')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md shadow-lg ${
            activeFilter === 'shelter'
              ? 'bg-emerald-600 text-white shadow-emerald-600/40'
              : 'bg-navy-900/90 text-slate-300 border border-navy-700 hover:bg-navy-800'
          }`}
        >
          ⛺ Shelters
        </button>

        <button
          onClick={() => setActiveFilter('hazard')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition backdrop-blur-md shadow-lg ${
            activeFilter === 'hazard'
              ? 'bg-amber-600 text-slate-950 font-black shadow-amber-600/40'
              : 'bg-navy-900/90 text-slate-300 border border-navy-700 hover:bg-navy-800'
          }`}
        >
          ⚠️ Hazards ({roadHazards.length})
        </button>
      </div>

      {/* Floating Map API & Layer Selector Pill */}
      <div className="absolute left-3 bottom-16 z-10">
        <button
          onClick={() => setShowSettingsModal(true)}
          title="Configure Map API Key & Tile Providers"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-navy-900/95 hover:bg-navy-850 text-slate-200 border border-blue-500/40 text-[11px] font-bold shadow-xl backdrop-blur-md active:scale-95 transition group"
        >
          <Key className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
          <span className="truncate max-w-[110px]">
            {activeProviderInfo.name.split(' ')[0]}
          </span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded border ${
              isKeyMissing
                ? 'bg-red-500/20 text-red-300 border-red-500/30 font-bold'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isKeyMissing ? 'No Key' : 'Active'}
          </span>
        </button>
      </div>

      {/* Floating GPS & Refresh Controls */}
      <div className="absolute right-3 bottom-16 z-10 flex flex-col gap-2">
        <button
          onClick={centerOnUser}
          title="Center on my GPS location"
          className="w-10 h-10 rounded-xl bg-navy-900/90 hover:bg-navy-800 text-blue-400 border border-navy-700 flex items-center justify-center shadow-xl backdrop-blur-md active:scale-95 transition"
        >
          <Navigation className="w-5 h-5" />
        </button>

        <button
          onClick={loadPOIs}
          disabled={loadingPOIs}
          title="Refresh Overpass POIs"
          className="w-10 h-10 rounded-xl bg-navy-900/90 hover:bg-navy-800 text-slate-300 border border-navy-700 flex items-center justify-center shadow-xl backdrop-blur-md active:scale-95 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loadingPOIs ? 'animate-spin text-red-400' : ''}`} />
        </button>
      </div>

      {/* Active Navigation Guidance Banner */}
      {activeRoute && routeDestFacility && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-navy-900/95 border border-cyan-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5 pr-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Emergency Routing Active
              </div>
              <div className="text-xs font-bold text-white truncate max-w-[170px]">
                {routeDestFacility.name}
              </div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                {activeRoute.distanceKm} km • ~{activeRoute.durationMinutes} mins
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${routeDestFacility.phone || '108'}`}
              className="p-2 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center"
              title="Call Facility"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={handleClearRoute}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white border border-navy-700"
              title="Cancel Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Map Settings & API Key Modal */}
      <MapSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onConfigChanged={handleConfigChanged}
      />
    </div>
  );
};
