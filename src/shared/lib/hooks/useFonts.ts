import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        "ZonaPro-Regular": require("@/assets/fonts/ZonaPro-Regular.ttf"),
        "ZonaPro-Thin": require("@/assets/fonts/ZonaPro-Thin.ttf"),
        "ZonaPro-Bold": require("@/assets/fonts/ZonaPro-Bold.ttf"),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  return fontsLoaded;
};
