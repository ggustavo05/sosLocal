import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import riskAreasService from '../../src/services/riskAreasService';
import { RiskArea } from '../../src/types/riskAreas';

// Importação condicional do WebView apenas para mobile
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('WebView não disponível nesta plataforma');
  }
}

export default function MapSection() {
  const mapRef = useRef<any>(null);
  const webViewRef = useRef<any>(null);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar áreas de risco ao montar o componente
  useEffect(() => {
    loadRiskAreas();
  }, []);

  const loadRiskAreas = async () => {
    console.log('=== CARREGANDO ÁREAS DE RISCO NO MAPA ===');
    setLoading(true);
    setError(null);

    try {
      const areas = await riskAreasService.fetchRiskAreas();
      setRiskAreas(areas);
      console.log(`✅ ${areas.length} áreas de risco carregadas com sucesso`);
      
      // Estatísticas
      const stats = riskAreasService.getStatistics(areas);
      console.log('📊 Estatísticas:', stats);
    } catch (err: any) {
      console.error('❌ Erro ao carregar áreas de risco:', err);
      setError(err.message || 'Erro ao carregar áreas de risco');
    } finally {
      setLoading(false);
    }
  };

  // Gerar HTML com marcadores de risco
  const generateMapHTML = () => {
    const markersScript = riskAreas.map((area) => {
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
            <span style="font-size: 12px; color: #666;">
              Lat: ${area.latitude.toFixed(6)}<br/>
              Lng: ${area.longitude.toFixed(6)}
            </span>
          </div>
        \`)
        .addTo(map);
      `;
    }).join('\n');

    // Calcular centro do mapa baseado nas áreas
    let centerLat = -23.5505;
    let centerLng = -46.6333;
    let zoom = 13;

    if (riskAreas.length > 0) {
      const lats = riskAreas.map(a => a.latitude);
      const lngs = riskAreas.map(a => a.longitude);
      centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      
      // Ajustar zoom baseado na dispersão dos pontos
      const latRange = Math.max(...lats) - Math.min(...lats);
      const lngRange = Math.max(...lngs) - Math.min(...lngs);
      const maxRange = Math.max(latRange, lngRange);
      
      if (maxRange > 0.5) zoom = 10;
      else if (maxRange > 0.2) zoom = 11;
      else if (maxRange > 0.1) zoom = 12;
      else zoom = 13;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            #map {
              width: 100%;
              height: 100%;
            }
            .legend {
              position: absolute;
              bottom: 20px;
              right: 10px;
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              font-family: Arial, sans-serif;
              font-size: 12px;
              z-index: 1000;
            }
            .legend-title {
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 13px;
            }
            .legend-item {
              display: flex;
              align-items: center;
              margin: 3px 0;
            }
            .legend-color {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin-right: 8px;
              border: 2px solid white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="legend">
            <div class="legend-title">Níveis de Risco</div>
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
            console.log('=== INICIALIZANDO MAPA LEAFLET ===');
            
            // Inicializar o mapa
            var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
            
            // Adicionar camada de tiles do OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            
            console.log('✅ Mapa inicializado');
            console.log('📍 Centro: [${centerLat}, ${centerLng}]');
            console.log('🔍 Zoom: ${zoom}');
            
            // Adicionar marcadores de áreas de risco
            ${markersScript}
            
            console.log('✅ ${riskAreas.length} marcadores adicionados ao mapa');
          </script>
        </body>
      </html>
    `;
  };

  const htmlContent = generateMapHTML();

  // Renderização para web - carregar Leaflet diretamente no DOM
  if (Platform.OS === 'web') {
    useEffect(() => {
      if (typeof window !== 'undefined' && mapRef.current && !loading && riskAreas.length > 0) {
        const loadLeaflet = () => {
          // Carregar CSS
          if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
          }

          // Carregar JS
          if (!(window as any).L && !document.getElementById('leaflet-js')) {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
              initializeMap();
            };
            document.body.appendChild(script);
          } else if ((window as any).L) {
            initializeMap();
          }
        };

        const initializeMap = () => {
          if (mapRef.current && (window as any).L) {
            // Calcular centro
            let centerLat = -23.5505;
            let centerLng = -46.6333;
            let zoom = 13;

            if (riskAreas.length > 0) {
              const lats = riskAreas.map(a => a.latitude);
              const lngs = riskAreas.map(a => a.longitude);
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

            const map = (window as any).L.map(mapRef.current).setView([centerLat, centerLng], zoom);
            (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);

            // Adicionar marcadores
            riskAreas.forEach((area) => {
              const config = riskAreasService.getMarkerConfig(area.risco_previsto);
              (window as any).L.circleMarker([area.latitude, area.longitude], {
                radius: 10,
                fillColor: config.fillColor,
                color: config.color,
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              })
              .bindPopup(`
                <div style="text-align: center; padding: 5px;">
                  <strong style="font-size: 14px;">${config.label}</strong><br/>
                  <span style="font-size: 12px; color: #666;">
                    Lat: ${area.latitude.toFixed(6)}<br/>
                    Lng: ${area.longitude.toFixed(6)}
                  </span>
                </div>
              `)
              .addTo(map);
            });
          }
        };

        setTimeout(loadLeaflet, 100);
      }
    }, [riskAreas, loading]);

    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Carregando áreas de risco...</Text>
            </View>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}
          {!loading && !error && (
            <>
              {/* @ts-ignore - div é suportado pelo react-native-web */}
              <div
                ref={mapRef}
                id="leaflet-map"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 300,
                }}
              />
              {/* @ts-ignore */}
              <div style={{
                position: 'absolute',
                bottom: 20,
                right: 10,
                background: 'white',
                padding: 10,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 12,
                zIndex: 1000,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 13 }}>
                  Níveis de Risco
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', marginRight: 8, backgroundColor: '#dc3545', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}></div>
                  <span>Alto</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', marginRight: 8, backgroundColor: '#ffc107', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}></div>
                  <span>Médio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', marginRight: 8, backgroundColor: '#28a745', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}></div>
                  <span>Baixo</span>
                </div>
              </div>
            </>
          )}
        </View>
      </View>
    );
  }

  // Renderização para mobile (Android/iOS)
  if (WebView) {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Carregando áreas de risco...</Text>
            </View>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}
          {!loading && !error && (
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          )}
        </View>
      </View>
    );
  }

  // Fallback caso WebView não esteja disponível
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            Mapa não disponível nesta plataforma
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
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
    borderColor: '#e9ecef',
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
  },
});


