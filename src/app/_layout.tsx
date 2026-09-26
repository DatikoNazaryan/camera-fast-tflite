import '@/src/locales/i18n';
import React from 'react';
import {
  Stack,
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { store, useAppSelector } from '@src/store';

function AppContent() {
  const colorScheme = useColorScheme();

  const token = useAppSelector((state) => state.AuthenticationReduce.token,);


  console.log(token);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={
            colorScheme === 'dark'
              ? DarkTheme
              : DefaultTheme
          }
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={Boolean(token)}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>

            <Stack.Protected guard={!token}>
              <Stack.Screen name="registration" />
            </Stack.Protected>
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}