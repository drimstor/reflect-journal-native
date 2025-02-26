import { create } from "zustand";

interface AnimationStore {
  tabBar: number;
  setTabBar: (value: number) => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  tabBar: 0,
  setTabBar: (value) => set({ tabBar: value }),
}));
