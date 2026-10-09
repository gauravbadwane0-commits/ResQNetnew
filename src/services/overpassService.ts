import { Facility } from '../types/emergency';
import { PAN_INDIA_FALLBACK_FACILITIES } from '../data/fallbackHospitals';
import { calculateHaversineDistanceKm } from '../utils/geoDistance';

interface OverpassElement {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    'name:en'?: string;
    amenity?: string;
    emergency?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    phone?: string;
    'contact:phone'?: string;
  };
}

export const fetchHealthcareFacilities = async (
  lat: number,
  lng: number,
  radiusMeters: number = 8000
): Promise<Facility[]> => {
  const query = `
    [out:json][timeout:10];
    (
      node["amenity"~"hospital|clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"~"hospital|clinic"](around:${radiusMeters},${lat},${lng});
    );
    out center 35;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Overpass returned status ${res.status}`);
    }

    const data = await res.json();
    const elements: OverpassElement[] = data.elements || [];

    if (elements.length > 0) {
      const liveFacilities: Facility[] = elements
        .filter((el) => el.tags && (el.tags.name || el.tags['name:en']))
        .map((el) => {
          const itemLat = el.lat || el.center?.lat || lat;
          const itemLng = el.lon || el.center?.lon || lng;
          const name = el.tags?.['name:en'] || el.tags?.name || 'Healthcare Facility';
          const isHospital = el.tags?.amenity === 'hospital';
          const hasEmergency = el.tags?.emergency === 'yes' || isHospital;
          const phone = el.tags?.phone || el.tags?.['contact:phone'] || '+91 108';

          return {
            id: `overpass-${el.id}`,
            name,
            type: isHospital ? 'hospital' : 'clinic',
            lat: itemLat,
            lng: itemLng,
            address: el.tags?.['addr:street'] || el.tags?.['addr:city'] || `${isHospital ? 'Hospital' : 'Clinic'} Campus`,
            phone,
            emergency24x7: hasEmergency,
            traumaCenter: isHospital,
            icuAvailable: isHospital,
            distanceKm: calculateHaversineDistanceKm(lat, lng, itemLat, itemLng),
          };
        });

      if (liveFacilities.length > 0) {
        return liveFacilities.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }
    }
  } catch (err) {
    console.warn('Overpass API unavailable or timed out, utilizing localized healthcare registry:', err);
  }

  // Graceful Offline / Fallback: Sort Pan-India registry by user distance
  const fallbackWithDistance = PAN_INDIA_FALLBACK_FACILITIES.map((facility) => ({
    ...facility,
    distanceKm: calculateHaversineDistanceKm(lat, lng, facility.lat, facility.lng),
  }));

  // Sort by closest facilities first
  return fallbackWithDistance.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
};
