import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';

import { AppProvider, useApp, useTheme } from './src/store';
import { AuthNavigator, MainNavigator } from './src/navigation/AppNavigator';
import { ToastProvider } from './src/toast';
import Onboarding from './src/components/Onboarding';

function Root() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const { ready, user, onboarded } = useApp();
  const { colors, isDark } = useTheme();

  if (!fontsLoaded || !ready) return null;

  // первый запуск — показываем онбординг
  if (!onboarded && !user) return <Onboarding />;

  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.bg,
      card: colors.bg,
      primary: colors.primary,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <Root />
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
