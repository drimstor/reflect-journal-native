import { create } from "zustand";

interface ScreenInfoStore {
  screenInfo: Record<string, any>;
  setScreenInfo: (value: Record<string, any>) => void;
  navigationScreenInfo: Record<string, any>;
  setNavigationScreenInfo: (value: Record<string, any>) => void;
}

export const useScreenInfoStore = create<ScreenInfoStore>((set) => ({
  screenInfo: { name: "" },
  setScreenInfo: (value) => set({ screenInfo: value }),
  navigationScreenInfo: { name: "" },
  setNavigationScreenInfo: (value) => set({ navigationScreenInfo: value }),
}));
