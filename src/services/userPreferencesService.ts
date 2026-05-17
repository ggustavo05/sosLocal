import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export const LOCATION_PREF_KEY = 'prefs_location_enabled';

export async function setLocationPreference(allowed: boolean): Promise<void> {
  await AsyncStorage.setItem(LOCATION_PREF_KEY, allowed ? 'true' : 'false');
}

export async function getLocationPreference(): Promise<boolean> {
  const v = await AsyncStorage.getItem(LOCATION_PREF_KEY);
  return v === 'true';
}

/**
 * Solicita permissão de localização em primeiro plano (após o usuário aceitar no cadastro).
 */
export async function requestForegroundLocationIfNeeded(): Promise<
  'granted' | 'denied' | 'undetermined'
> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'undetermined';
  } catch {
    return 'undetermined';
  }
}
