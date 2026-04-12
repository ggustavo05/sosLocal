// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="hometela" />
        <Stack.Screen name="orientacoes" />
        <Stack.Screen name="enchentes" />
        <Stack.Screen name="tempestades" />
        <Stack.Screen name="inundacoes" />
      </Stack>
    </QueryClientProvider>
  );
}
