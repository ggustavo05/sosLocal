import { Platform } from 'react-native';
import * as Location from 'expo-location';
import authService from './authService';

export type DeviceCoords = { latitude: number; longitude: number };

export type GetCurrentCoordsOptions = {
  /** Se true, não obtém posição sem sessão (comportamento do mapa). Padrão: true */
  onlyWhenLoggedIn?: boolean;
};

/**
 * Posição atual do dispositivo (web: Geolocation API; nativo: expo-location).
 * Usado no mapa e no SMS de emergência para não depender do CEP cadastrado.
 */
export async function getCurrentDeviceCoordinates(
  options: GetCurrentCoordsOptions = {}
): Promise<DeviceCoords | null> {
  const { onlyWhenLoggedIn = true } = options;
  if (onlyWhenLoggedIn) {
    const creds = await authService.getStoredCredentials();
    if (!creds) return null;
  }

  try {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
        );
      });
    }

    let perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== Location.PermissionStatus.GRANTED) {
      perm = await Location.requestForegroundPermissionsAsync();
    }
    if (perm.status !== Location.PermissionStatus.GRANTED) return null;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  } catch (e) {
    console.warn('currentLocationService: posição indisponível', e);
    return null;
  }
}

/** Texto curto para concatenar ao SMS (Twilio segmenta mensagens longas). */
export function formatGpsSuffixForSms(coords: DeviceCoords): string {
  const lat = coords.latitude.toFixed(6);
  const lng = coords.longitude.toFixed(6);
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  return `\n\n— Localização atual (GPS) —\nLat: ${lat}\nLng: ${lng}\nMapa: ${mapUrl}`;
}
