import { create } from "zustand";

interface HeaderStore {
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  subtitle: "",
  setSubtitle: (subtitle) => set({ subtitle }),
}));
