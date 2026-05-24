import { Platform } from 'react-native';
import * as Font from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

/** Garante @font-face "ionicons" no web antes de renderizar ícones. */
export async function loadWebIconFonts(): Promise<void> {
  if (Platform.OS !== 'web') return;
  if (Font.isLoaded('ionicons')) return;
  try {
    await Font.loadAsync(Ionicons.font);
  } catch {
    // index.html já injeta @font-face; não bloquear o app se o observer falhar
  }
}
