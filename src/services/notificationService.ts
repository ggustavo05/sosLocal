import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/** Rotas expo-router associadas ao toque na notificação. */
export type NotificationScreen = 'orientacoes' | 'hometela';

export type LocalNotificationPayload = {
  title: string;
  body: string;
  screen: NotificationScreen;
  /** Identificador opcional para dedupe ou analytics. */
  eventId?: string;
};

const ANDROID_CHANNEL_ID = 'alertas-sos';

let initialized = false;

export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function initNotifications(): Promise<void> {
  if (Platform.OS === 'web' || initialized) return;

  configureNotificationHandler();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Alertas SOS Localiza',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1B547D',
    });
  }

  initialized = true;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  await initNotifications();

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function presentLocalNotification(
  payload: LocalNotificationPayload
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: {
        screen: payload.screen,
        eventId: payload.eventId ?? null,
      },
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: null,
  });

  return id;
}

export async function presentRiskProximityAlert(params: {
  distanceMeters: number;
  alertKey: string;
}): Promise<string | null> {
  const dist =
    params.distanceMeters >= 1000
      ? `${(params.distanceMeters / 1000).toFixed(1)} km`
      : `${Math.round(params.distanceMeters)} m`;

  return presentLocalNotification({
    title: 'Alerta SOS Localiza',
    body: `Você está a cerca de ${dist} de uma área de alto risco. Veja orientações de segurança.`,
    screen: 'orientacoes',
    eventId: `risk:${params.alertKey}`,
  });
}

export async function presentSmsSentAlert(params: {
  ddd: string;
  phone: string;
  eventName: string;
}): Promise<string | null> {
  return presentLocalNotification({
    title: 'SMS de emergência enviado',
    body: `Mensagem enviada para +55 ${params.ddd} ${params.phone}. Evento: ${params.eventName}.`,
    screen: 'hometela',
    eventId: `sms:${params.ddd}${params.phone}:${Date.now()}`,
  });
}
