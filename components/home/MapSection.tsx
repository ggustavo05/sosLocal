import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

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

  const htmlContent = `
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
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          // Inicializar o mapa
          var map = L.map('map').setView([-23.5505, -46.6333], 13); // Coordenadas de São Paulo como padrão
          
          // Adicionar camada de tiles do OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);
          
          // Adicionar um marcador de exemplo
          var marker = L.marker([-23.5505, -46.6333]).addTo(map);
          marker.bindPopup('Localização de exemplo').openPopup();
        </script>
      </body>
    </html>
  `;

  // Renderização para web - carregar Leaflet diretamente no DOM
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Carregar Leaflet diretamente no DOM quando estiver na web
      if (typeof window !== 'undefined' && mapRef.current) {
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
              if (mapRef.current && (window as any).L) {
                const map = (window as any).L.map(mapRef.current).setView([-23.5505, -46.6333], 13);
                (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenStreetMap contributors',
                  maxZoom: 19
                }).addTo(map);
                const marker = (window as any).L.marker([-23.5505, -46.6333]).addTo(map);
                marker.bindPopup('Localização de exemplo').openPopup();
              }
            };
            document.body.appendChild(script);
          } else if ((window as any).L && mapRef.current) {
            // Se já carregado, inicializar direto
            const map = (window as any).L.map(mapRef.current).setView([-23.5505, -46.6333], 13);
            (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            const marker = (window as any).L.marker([-23.5505, -46.6333]).addTo(map);
            marker.bindPopup('Localização de exemplo').openPopup();
          }
        };

        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(loadLeaflet, 100);
      }
    }, []);

    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
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
        </View>
      </View>
    );
  }

  // Renderização para mobile (Android/iOS)
  if (WebView) {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: htmlContent }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      </View>
    );
  }

  // Fallback caso WebView não esteja disponível
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.fallbackContainer}>
          {/* Placeholder caso não tenha suporte */}
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
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
