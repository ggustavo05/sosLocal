import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RiskArea } from '../types/riskAreas';
import type { DeviceCoords } from '../services/currentLocationService';
import { findNearestHighRiskWithinRadius, riskAreaAlertKey } from '../utils/geo';
import { presentRiskProximityAlert, requestNotificationPermissions } from '../services/notificationService';

const STORAGE_PREFIX = 'soslocal_risk_alert:';
const ALERT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

type Options = {
  riskAreas: RiskArea[];
  userLocation: DeviceCoords | null;
  enabled: boolean;
};

/**
 * Dispara notificação local quando o utilizador está perto de área de alto risco
 * (dados da API + GPS), com dedupe por área e cooldown de 24h.
 */
export function useRiskProximityNotification({
  riskAreas,
  userLocation,
  enabled,
}: Options): void {
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || !userLocation || riskAreas.length === 0) return;

    let cancelled = false;

    (async () => {
      if (runningRef.current) return;
      runningRef.current = true;

      try {
        const nearby = findNearestHighRiskWithinRadius(userLocation, riskAreas);
        if (!nearby || cancelled) return;

        const alertKey = riskAreaAlertKey(nearby.area);
        const storageKey = `${STORAGE_PREFIX}${alertKey}`;

        const lastRaw = await AsyncStorage.getItem(storageKey);
        if (lastRaw) {
          const last = Number.parseInt(lastRaw, 10);
          if (!Number.isNaN(last) && Date.now() - last < ALERT_COOLDOWN_MS) {
            return;
          }
        }

        const granted = await requestNotificationPermissions();
        if (!granted || cancelled) return;

        const id = await presentRiskProximityAlert({
          distanceMeters: nearby.distanceMeters,
          alertKey,
        });

        if (id && !cancelled) {
          await AsyncStorage.setItem(storageKey, String(Date.now()));
        }
      } finally {
        runningRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, userLocation, riskAreas]);
}
