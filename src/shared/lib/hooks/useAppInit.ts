import { PATHS } from "@/src/shared/const";
import { tokenService } from "@/src/shared/store";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

// Предотвращаем автоматическое скрытие сплэш-скрина
SplashScreen.preventAutoHideAsync();

// Настраиваем анимацию fade для сплэш-скрина
SplashScreen.setOptions({ duration: 1000, fade: true });

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

  const onLayoutRootView = () => {
    SplashScreen.hide();
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
