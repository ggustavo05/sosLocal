import type { RiskArea } from '../types/riskAreas';

export type LatLng = { latitude: number; longitude: number };

const EARTH_RADIUS_M = 6_371_000;

/** Distância em metros entre dois pontos (fórmula de Haversine). */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export const HIGH_RISK_PROXIMITY_METERS = 800;

export interface NearbyHighRiskResult {
  area: RiskArea;
  distanceMeters: number;
}

/**
 * Retorna a área de alto risco mais próxima dentro do raio, ou null.
 */
export function findNearestHighRiskWithinRadius(
  user: LatLng,
  areas: RiskArea[],
  radiusMeters: number = HIGH_RISK_PROXIMITY_METERS
): NearbyHighRiskResult | null {
  let best: NearbyHighRiskResult | null = null;

  for (const area of areas) {
    if (area.risco_previsto.toLowerCase() !== 'alto') continue;

    const distanceMeters = haversineMeters(user, {
      latitude: area.latitude,
      longitude: area.longitude,
    });

    if (distanceMeters > radiusMeters) continue;

    if (!best || distanceMeters < best.distanceMeters) {
      best = { area, distanceMeters };
    }
  }

  return best;
}

/** Chave estável para deduplicar alertas da mesma área (~110 m de precisão). */
export function riskAreaAlertKey(area: RiskArea): string {
  const lat = area.latitude.toFixed(3);
  const lng = area.longitude.toFixed(3);
  return `${lat}:${lng}:alto`;
}
