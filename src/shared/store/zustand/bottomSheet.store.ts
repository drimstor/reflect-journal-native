import { create } from "zustand";
import { BottomSheetAction } from "@/src/shared/ui/BottomSheetActions/model/types";

interface BottomSheetStore {
  actions: BottomSheetAction[];
  setActions: (actions: BottomSheetAction[]) => void;
  resetActions: () => void;

  isBottomSheetVisible: boolean;
  setBottomSheetVisible: (value: boolean) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  actions: [],
  setActions: (actions) => {
    set({ actions });
  },
  resetActions: () => set({ actions: [] }),

  isBottomSheetVisible: false,
  setBottomSheetVisible: (value) => set({ isBottomSheetVisible: value }),
}));
