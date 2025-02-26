import { useState, useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { tokenService } from "@/src/shared/store";
import { PATHS } from "@/src/shared/const";

// Предотвращаем автоматическое скрытие сплэш-скрина
SplashScreen.preventAutoHideAsync();

export const useAppInit = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialPath, setInitialPath] = useState(PATHS.MAIN_STACK);

  const initializeApp = useCallback(async () => {
    try {
      const isAuthenticated = await tokenService.isAuthenticated();
      await tokenService.debugTokens();

      if (isAuthenticated) {
        setInitialPath(PATHS.MAIN_STACK);
      } else {
        setInitialPath(PATHS.AUTH);
      }
    } catch (error) {
      console.warn("Error loading app resources:", error);
    } finally {
      setAppIsReady(true);
    }
  }, [tokenService]);

  const onLayoutRootView = async () => {
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return {
    onLayoutRootView,
    initialPath,
    appIsReady,
  };
};
