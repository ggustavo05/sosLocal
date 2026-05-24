// app/_layout.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme } from '../src/theme';
import { loadWebIconFonts } from '../src/utils/loadWebIconFonts';
import {
  configureNotificationHandler,
  initNotifications,
  type NotificationScreen,
} from '../src/services/notificationService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function NotificationBootstrap() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    configureNotificationHandler();
    void initNotifications();

    const navigateFromNotification = (screen: unknown) => {
      const target = screen as NotificationScreen | undefined;
      if (target === 'orientacoes') {
        router.push('/orientacoes');
      } else if (target === 'hometela') {
        router.push('/hometela');
      }
    };

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      navigateFromNotification(screen);
    });

    return () => {
      responseSub.remove();
    };
  }, [router]);

  return null;
}

function AppNavigation() {
  return (
    <>
      <NotificationBootstrap />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="hometela" />
        <Stack.Screen name="orientacoes" />
        <Stack.Screen name="enchentes" />
        <Stack.Screen name="tempestades" />
        <Stack.Screen name="inundacoes" />
        <Stack.Screen name="sobre" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      void loadWebIconFonts();
    }
  }, []);

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
