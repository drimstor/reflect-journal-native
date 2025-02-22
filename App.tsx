import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/shared/api/api";
import AppContent from "./app/AppContent";
import { useFonts } from "@/src/shared/lib/hooks/useFonts";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";
import { EventProvider } from "react-native-outside-press";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Предотвращаем автоматическое скрытие сплэш-скрина
SplashScreen.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = useFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <QueryClientProvider client={queryClient}>
          <EventProvider>
            <AppContent />
          </EventProvider>
        </QueryClientProvider>
      </View>
    </SafeAreaProvider>
  );
}
