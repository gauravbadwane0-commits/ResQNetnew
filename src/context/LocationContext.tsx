import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  cityName: string;
  isManual: boolean;
}

interface LocationContextType {
  location: UserLocation;
  loadingLocation: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unavailable';
  errorMsg: string | null;
  requestCurrentLocation: () => void;
  setManualLocation: (lat: number, lng: number, cityName: string) => void;
}

// Preset Indian Emergency Hubs for Instant Manual Switching / Testing
export const PRESET_CITIES = [
  { name: 'Mumbai (Coastal Rain Belt)', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi NCR (Yamuna Basin)', lat: 28.6139, lng: 77.2090 },
  { name: 'Pune (Mula-Mutha River)', lat: 18.5204, lng: 73.8567 },
  { name: 'Chennai (Adyar Basin)', lat: 13.0827, lng: 80.2707 },
  { name: 'Bengaluru (Urban Lakes)', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata (Hooghly Belt)', lat: 22.5726, lng: 88.3639 },
];

const DEFAULT_LOCATION: UserLocation = {
  lat: 19.0760,
  lng: 72.8777,
  cityName: 'Mumbai (Default Hub)',
  isManual: false,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('resqnet_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_LOCATION;
  });

  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unavailable'>('prompt');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      setErrorMsg('Geolocation not supported by device');
      return;
    }

    setLoadingLocation(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc: UserLocation = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy),
          cityName: 'Live GPS Pin',
          isManual: false,
        };
        setLocation(newLoc);
        setPermissionStatus('granted');
        setLoadingLocation(false);
        localStorage.setItem('resqnet_location', JSON.stringify(newLoc));
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setPermissionStatus('denied');
        setLoadingLocation(false);
        setErrorMsg('Location access denied or unavailable. Using regional hub.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const setManualLocation = (lat: number, lng: number, cityName: string) => {
    const newLoc: UserLocation = {
      lat,
      lng,
      cityName,
      isManual: true,
    };
    setLocation(newLoc);
    setErrorMsg(null);
    localStorage.setItem('resqnet_location', JSON.stringify(newLoc));
  };

  useEffect(() => {
    // Attempt automatic GPS fetch once on app load
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((res) => {
        setPermissionStatus(res.state as 'granted' | 'denied' | 'prompt');
        if (res.state === 'granted') {
          requestCurrentLocation();
        }
      }).catch(() => {
        // Fallback
      });
    }
  }, [requestCurrentLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        loadingLocation,
        permissionStatus,
        errorMsg,
        requestCurrentLocation,
        setManualLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};
