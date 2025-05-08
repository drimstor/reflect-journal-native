import { create } from "zustand";

interface StatusBarState {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  toggleVisibility: () => void;
}

export const useStatusBarStore = create<StatusBarState>((set) => ({
  isVisible: true,
  setIsVisible: (value) => set({ isVisible: value }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
