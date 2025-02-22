import { create } from "zustand";
import {
  Platform,
  Dimensions,
  StatusBar,
  ScaledSize,
  PlatformIOSStatic,
} from "react-native";
import * as Device from "expo-device";

interface DeviceState {
  // Platform
  platform: typeof Platform.OS;
  isIOS: boolean;
  isAndroid: boolean;

  // Screen
  window: ScaledSize;
  screen: ScaledSize;
  isTablet: boolean;

  // Device
  brand: string;
  model: string;
  statusBarHeight: number;

  // Methods
  updateDimensions: (window: ScaledSize, screen: ScaledSize) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  // Platform
  platform: Platform.OS as typeof Platform.OS,
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",

  // Screen
  window: Dimensions.get("window"),
  screen: Dimensions.get("screen"),
  isTablet:
    (Dimensions.get("screen").width > 768 ||
      (Platform as PlatformIOSStatic)?.isPad) ??
    false,

  // Device
  brand: Device.brand || "",
  model: Device.modelName || "",
  statusBarHeight: StatusBar.currentHeight || 0,

  // Methods
  updateDimensions: (window: ScaledSize, screen: ScaledSize) =>
    set({ window, screen }),
}));

// Слушатель изменения размеров экрана
Dimensions.addEventListener("change", ({ window, screen }) => {
  useDeviceStore.getState().updateDimensions(window, screen);
});
