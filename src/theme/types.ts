/** Preferência persistida: seguir SO ou forçar claro/escuro. */
export type ThemePreference = 'system' | 'light' | 'dark';

/** Tema efetivo aplicado à UI (após resolver `system`). */
export type EffectiveColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  inputBackground: string;
  inputBorder: string;
  primary: string;
  onPrimary: string;
  secondaryButtonBg: string;
  secondaryButtonBorder: string;
  secondaryButtonText: string;
  accent: string;
  accentMuted: string;
  error: string;
  errorBackground: string;
  errorBorder: string;
  success: string;
  warning: string;
  warningBackground: string;
  warningText: string;
  emergency: string;
  emergencyMuted: string;
  iconMuted: string;
  shadow: string;
  overlay: string;
  tabInactiveText: string;
  dialogCard: string;
  dialogMessage: string;
  mapBorder: string;
  mapLoadingBg: string;
  mapErrorBg: string;
  mapFallbackBg: string;
  spinner: string;
  strengthTrack: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchThumb: string;
}

export interface AppTheme {
  scheme: EffectiveColorScheme;
  colors: ThemeColors;
}
