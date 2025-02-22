import { create } from "zustand";

interface ChatStore {
  isBottomSheetVisible: boolean;
  setBottomSheetVisible: (value: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isBottomSheetVisible: false,
  setBottomSheetVisible: (value) => set({ isBottomSheetVisible: value }),
}));
