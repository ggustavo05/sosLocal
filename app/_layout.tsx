// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/theme';

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (garbage collection time)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function AppNavigation() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="hometela" />
      <Stack.Screen name="orientacoes" />
      <Stack.Screen name="enchentes" />
      <Stack.Screen name="tempestades" />
      <Stack.Screen name="inundacoes" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStatusBar />
        <QueryClientProvider client={queryClient}>
          <AppNavigation />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
