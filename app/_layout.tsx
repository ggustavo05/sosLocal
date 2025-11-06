// app/_layout.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthScreen from '../app/authtela';
import HomeScreen from '../app/hometela';

export default function RootLayout() {


  return (   
      <Stack>
        <Stack.Screen name="index"/>
        <Stack.Screen name="hometela"/>
      </Stack>
  );
}
