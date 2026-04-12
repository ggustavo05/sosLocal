// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
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
