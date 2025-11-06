// app/_layout.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthScreen from '../app/authtela';
import HomeScreen from '../app/hometela';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="home">
            {() => <HomeScreen onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="auth">
            {() => <AuthScreen onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
