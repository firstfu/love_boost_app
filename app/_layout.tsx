import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="settings" options={{ title: '應用設定', headerShown: true }} />
        <Stack.Screen name="guide" options={{ title: '使用指南', headerShown: true }} />
        <Stack.Screen name="support" options={{ title: '聯絡支援', headerShown: true }} />
        <Stack.Screen name="about" options={{ title: '關於我們', headerShown: true }} />
        <Stack.Screen name="privacy" options={{ title: '隱私權政策', headerShown: true }} />
        <Stack.Screen name="terms" options={{ title: '使用條款', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
