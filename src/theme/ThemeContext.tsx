import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import type { AppTheme, EffectiveColorScheme, ThemePreference } from './types';
import { getThemeForScheme } from './themes';

const STORAGE_KEY = 'soslocal_theme_preference';

export interface ThemeContextValue {
  /** Tema visual atual (claro ou escuro). */
  theme: AppTheme;
  colors: AppTheme['colors'];
  /** `true` quando o esquema efetivo é escuro. */
  isDark: boolean;
  /** Preferência guardada: `system` segue o SO. */
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => Promise<void>;
  /** Alterna entre claro e escuro e persiste (deixa de seguir o SO até o utilizador escolher “Sistema” de novo). */
  toggleTheme: () => Promise<void>;
  /** Volta a seguir o tema do sistema operativo e persiste. */
  useSystemTheme: () => Promise<void>;
  /** Indica se a preferência ainda está a ser lida do armazenamento. */
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function parseStored(value: string | null): ThemePreference {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          setPreferenceState(parseStored(raw));
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveScheme: EffectiveColorScheme = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const theme = useMemo(() => getThemeForScheme(effectiveScheme), [effectiveScheme]);
  const isDark = effectiveScheme === 'dark';

  const persist = useCallback(async (p: ThemePreference) => {
    setPreferenceState(p);
    await AsyncStorage.setItem(STORAGE_KEY, p);
  }, []);

  const setPreference = useCallback(
    async (p: ThemePreference) => {
      await persist(p);
    },
    [persist]
  );

  const toggleTheme = useCallback(async () => {
    const next: EffectiveColorScheme = isDark ? 'light' : 'dark';
    await persist(next);
  }, [isDark, persist]);

  const useSystemTheme = useCallback(async () => {
    await persist('system');
  }, [persist]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: theme.colors,
      isDark,
      preference,
      setPreference,
      toggleTheme,
      useSystemTheme,
      isHydrated,
    }),
    [theme, isDark, preference, setPreference, toggleTheme, useSystemTheme, isHydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx == null) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
