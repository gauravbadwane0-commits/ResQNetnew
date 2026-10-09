export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array
  distanceKm: number;
  durationMinutes: number;
  summary: string;
}

export const fetchRouteDirections = async (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult> => {
  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // GeoJSON coordinates come in [lon, lat], leaflet polyline needs [lat, lon]
        const latLngs: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        return {
          coordinates: latLngs,
          distanceKm: Number((route.distance / 1000).toFixed(2)),
          durationMinutes: Math.round(route.duration / 60),
          summary: route.legs?.[0]?.summary || 'Primary Evacuation Corridor',
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing offline, generating direct emergency path:', err);
  }

  // Offline Geodesic Fallback: generate smooth 5-point interpolated line
  const waypoints: [number, number][] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = startLat + (destLat - startLat) * ratio;
    const lng = startLng + (destLng - startLng) * ratio;
    waypoints.push([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
  }

  // Rough distance calculation
  const roughDistance = Math.sqrt(
    Math.pow((destLat - startLat) * 111, 2) +
    Math.pow((destLng - startLng) * 111 * Math.cos((startLat * Math.PI) / 180), 2)
  );

  return {
    coordinates: waypoints,
    distanceKm: Number(roughDistance.toFixed(2)),
    durationMinutes: Math.round(roughDistance * 3.5),
    summary: 'Direct Offline Emergency Corridor',
  };
};
