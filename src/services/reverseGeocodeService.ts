import API_CONFIG from '../config/api';
import authService from './authService';

/**
 * Obtém uma linha de endereço (rua, número, bairro, cidade, UF) via backend (Nominatim).
 * Evita CORS do browser para o OpenStreetMap.
 */
export async function fetchReverseGeocodeLine(lat: number, lon: number): Promise<string | null> {
  const header = await authService.getAuthHeader();
  if (!header) return null;
  const q = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOBILE.REVERSE_GEOCODE}?${q}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: header, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { enderecoLinha?: string };
    const line = j.enderecoLinha?.trim();
    return line && line.length > 0 ? line : null;
  } catch {
    return null;
  }
}
