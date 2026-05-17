import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import riskAreasService from '../../src/services/riskAreasService';
import { getCurrentDeviceCoordinates } from '../../src/services/currentLocationService';
import { RiskArea } from '../../src/types/riskAreas';
import type { ThemeColors } from '../../src/theme/types';
import { useTheme } from '../../src/theme';

let WebView: React.ComponentType<any> | null = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch {
    console.warn('WebView não disponível nesta plataforma');
  }
}

type UserCoords = { latitude: number; longitude: number };

function computeCenterAndZoom(areas: RiskArea[]): { centerLat: number; centerLng: number; zoom: number } {
  let centerLat = -23.5505;
  let centerLng = -46.6333;
  let zoom = 13;

  if (areas.length > 0) {
    const lats = areas.map((a) => a.latitude);
    const lngs = areas.map((a) => a.longitude);
    centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);
    if (maxRange > 0.5) zoom = 10;
    else if (maxRange > 0.2) zoom = 11;
    else if (maxRange > 0.1) zoom = 12;
    else zoom = 13;
  }

  return { centerLat, centerLng, zoom };
}

/** HTML Leaflet: áreas de risco + opcional marcador do usuário + fitBounds */
function generateMapHTML(areas: RiskArea[], user: UserCoords | null, c: ThemeColors): string {
  const { centerLat, centerLng, zoom } = computeCenterAndZoom(areas);

  const markersScript = areas
    .map((area) => {
      const config = riskAreasService.getMarkerConfig(area.risco_previsto);
      return `
        L.circleMarker([${area.latitude}, ${area.longitude}], {
          radius: 10,
          fillColor: '${config.fillColor}',
          color: '${config.color}',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        })
        .bindPopup(\`
          <div style="text-align: center; padding: 5px;">
            <strong style="font-size: 14px;">${config.label}</strong><br/>
            <span style="font-size: 12px; color: ${c.textSecondary};">
              Lat: ${area.latitude.toFixed(6)}<br/>
              Lng: ${area.longitude.toFixed(6)}
            </span>
          </div>
        \`)
        .addTo(map);
      `;
    })
    .join('\n');

  const userLat = user?.latitude;
  const userLng = user?.longitude;
  const userScript =
    userLat != null && userLng != null
      ? `
    var __userLat = ${userLat};
    var __userLng = ${userLng};
    L.circleMarker([__userLat, __userLng], {
      radius: 12,
      fillColor: '${c.primary}',
      color: '#ffffff',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.95
    })
    .bindPopup('<div style="text-align:center;padding:6px;"><strong>Você está aqui</strong></div>')
    .addTo(map);

    var __pts = [];
    ${areas.map((a) => `__pts.push([${a.latitude}, ${a.longitude}]);`).join('\n')}
    __pts.push([__userLat, __userLng]);
    if (__pts.length === 1) {
      map.setView(__pts[0], 15);
    } else {
      try {
        map.fitBounds(L.latLngBounds(__pts), { padding: [44, 44], maxZoom: 15 });
      } catch (e) { console.warn(e); }
    }
    `
      : '';

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { width: 100%; height: 100%; overflow: hidden; }
            #map { width: 100%; height: 100%; }
            .legend {
              position: absolute;
              bottom: 20px;
              right: 10px;
              background: ${c.surface};
              color: ${c.text};
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              font-family: Arial, sans-serif;
              font-size: 12px;
              z-index: 1000;
            }
            .legend-title { font-weight: bold; margin-bottom: 5px; font-size: 13px; color: ${c.text}; }
            .legend-item { display: flex; align-items: center; margin: 3px 0; }
            .legend-color {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin-right: 8px;
              border: 2px solid ${c.surface};
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="legend">
            <div class="legend-title">Legenda</div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${c.primary};"></div>
              <span>Você</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #dc3545;"></div>
              <span>Alto</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ffc107;"></div>
              <span>Médio</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #28a745;"></div>
              <span>Baixo</span>
            </div>
          </div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            ${markersScript}
            ${userScript}
          </script>
        </body>
      </html>
    `;
}

export default function MapSection() {
  const { colors } = useTheme();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstance = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);

  const {
    data: riskAreas = [],
    isLoading: loading,
    error,
    isError,
  } = useQuery({
    queryKey: ['riskAreas'],
    queryFn: async () => {
      const areas = await riskAreasService.fetchRiskAreas();
      return areas;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  /** Com sessão ativa, obtém GPS (mesma lógica que o SMS de emergência). */
  const resolveUserLocation = useCallback(
    (): Promise<UserCoords | null> => getCurrentDeviceCoordinates({ onlyWhenLoggedIn: true }),
    []
  );

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    (async () => {
      const loc = await resolveUserLocation();
      if (!cancelled) setUserLocation(loc);
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, resolveUserLocation]);

  const htmlContent = useMemo(
    () => generateMapHTML(riskAreas, userLocation, colors),
    [riskAreas, userLocation, colors]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingVertical: 20,
          marginHorizontal: 20,
          marginVertical: 10,
          borderRadius: 15,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        mapContainer: {
          height: 300,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.mapBorder,
          position: 'relative',
        },
        webview: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.mapLoadingBg,
        },
        loadingText: {
          marginTop: 10,
          fontSize: 14,
          color: colors.textSecondary,
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.mapErrorBg,
          padding: 20,
        },
        errorText: {
          fontSize: 14,
          color: colors.warningText,
          textAlign: 'center',
        },
        fallbackContainer: {
          flex: 1,
          backgroundColor: colors.mapFallbackBg,
          justifyContent: 'center',
          alignItems: 'center',
        },
        fallbackText: {
          fontSize: 14,
          color: colors.textSecondary,
        },
      }),
    [colors]
  );

  /** Web: Leaflet no DOM + marcador do usuário */
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    if (loading || isError) return;

    const el = mapRef.current;
    if (!el) return;

    const L = (window as any).L;
    const init = () => {
      if (!el || !(window as any).L) return;

      if (leafletMapInstance.current) {
        try {
          leafletMapInstance.current.remove();
        } catch {
          /* ignore */
        }
        leafletMapInstance.current = null;
      }

      const { centerLat, centerLng, zoom } = computeCenterAndZoom(riskAreas);
      const map = (window as any).L.map(el).setView([centerLat, centerLng], zoom);
      leafletMapInstance.current = map;

      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const points: [number, number][] = [];

      riskAreas.forEach((area) => {
        const config = riskAreasService.getMarkerConfig(area.risco_previsto);
        (window as any).L.circleMarker([area.latitude, area.longitude], {
          radius: 10,
          fillColor: config.fillColor,
          color: config.color,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup(
            `<div style="text-align:center;padding:5px;"><strong>${config.label}</strong><br/><span style="font-size:12px;color:${colors.textSecondary};">Lat: ${area.latitude.toFixed(6)}<br/>Lng: ${area.longitude.toFixed(6)}</span></div>`
          )
          .addTo(map);
        points.push([area.latitude, area.longitude]);
      });

      if (userLocation) {
        (window as any).L.circleMarker([userLocation.latitude, userLocation.longitude], {
          radius: 12,
          fillColor: colors.primary,
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.95,
        })
          .bindPopup('<div style="text-align:center;padding:6px;"><strong>Você está aqui</strong></div>')
          .addTo(map);
        points.push([userLocation.latitude, userLocation.longitude]);
      }

      if (points.length === 1) {
        map.setView(points[0], 15);
      } else if (points.length > 1) {
        try {
          map.fitBounds((window as any).L.latLngBounds(points), { padding: [44, 44], maxZoom: 15 });
        } catch {
          /* ignore */
        }
      }
    };

    const loadLeaflet = () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!(window as any).L && !document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => init();
        document.body.appendChild(script);
      } else if ((window as any).L) {
        init();
      }
    };

    const t = setTimeout(loadLeaflet, 50);
    return () => {
      clearTimeout(t);
      if (leafletMapInstance.current) {
        try {
          leafletMapInstance.current.remove();
        } catch {
          /* ignore */
        }
        leafletMapInstance.current = null;
      }
    };
  }, [riskAreas, loading, isError, userLocation, colors]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.spinner} />
              <Text style={styles.loadingText}>Carregando áreas de risco...</Text>
            </View>
          )}
          {isError && error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                ❌ {error instanceof Error ? error.message : 'Erro ao carregar áreas de risco'}
              </Text>
            </View>
          )}
          {!loading && !isError && (
            <>
              {/* @ts-expect-error div no react-native-web */}
              <div
                ref={mapRef as any}
                id="leaflet-map"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 300,
                }}
              />
              {/* @ts-expect-error legenda web */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  right: 10,
                  background: colors.surface,
                  color: colors.text,
                  padding: 10,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 12,
                  zIndex: 1000,
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 13 }}>Legenda</div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      marginRight: 8,
                      backgroundColor: colors.primary,
                      border: `2px solid ${colors.surface}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                  <span>Você</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      marginRight: 8,
                      backgroundColor: '#dc3545',
                      border: `2px solid ${colors.surface}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                  <span>Alto</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      marginRight: 8,
                      backgroundColor: '#ffc107',
                      border: `2px solid ${colors.surface}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                  <span>Médio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      marginRight: 8,
                      backgroundColor: '#28a745',
                      border: `2px solid ${colors.surface}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                  <span>Baixo</span>
                </div>
              </div>
            </>
          )}
        </View>
      </View>
    );
  }

  if (WebView) {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.spinner} />
              <Text style={styles.loadingText}>Carregando áreas de risco...</Text>
            </View>
          )}
          {isError && error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                ❌ {error instanceof Error ? error.message : 'Erro ao carregar áreas de risco'}
              </Text>
            </View>
          )}
          {!loading && !isError && (
            <WebView
              key={`map-${userLocation?.latitude ?? 'x'}-${userLocation?.longitude ?? 'y'}-${riskAreas.length}`}
              source={{ html: htmlContent }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              geolocationEnabled
              startInLoadingState
              scalesPageToFit
              originWhitelist={['*']}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>Mapa não disponível nesta plataforma</Text>
        </View>
      </View>
    </View>
  );
}
