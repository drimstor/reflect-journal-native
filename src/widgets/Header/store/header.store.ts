import { create } from "zustand";

interface HeaderStore {
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  subtitle: "",
  setSubtitle: (subtitle) => set({ subtitle }),
  title: "",
  setTitle: (title) => set({ title }),
}));
