import { create } from "zustand";
import { BottomSheetAction } from "../../ui/BottomSheetContent/model/types";

export type FlowId = string;
export type ScreenId = string;

interface BottomSheetStore {
  actions: BottomSheetAction[];
  setActions: (actions: BottomSheetAction[]) => void;
  resetActions: () => void;

  isBottomSheetVisible: boolean;
  setBottomSheetVisible: (value: boolean) => void;

  bottomSheetHeight: number;
  setBottomSheetHeight: (height: number) => void;

  currentFlow: FlowId | null;
  currentScreen: ScreenId | null;
  flowData: Record<string, any>;

  navigateToFlow: (flowId: FlowId, screenId: ScreenId) => void;
  setFlowData: (data: Record<string, any>) => void;
  resetFlow: () => void;
  resetFlowData: () => void;

  navigation: {
    isNavigate: boolean;
    navigateToPath: string;
    navigateParams: Record<string, any>;
  };

  setNavigation: (
    isNavigate: boolean,
    path?: string,
    params?: Record<string, any>
  ) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  actions: [],
  setActions: (actions) => {
    set({ actions });
  },
  resetActions: () => set({ actions: [] }),

  isBottomSheetVisible: false,
  setBottomSheetVisible: (value) => set({ isBottomSheetVisible: value }),

  bottomSheetHeight: 0,
  setBottomSheetHeight: (height) => set({ bottomSheetHeight: height }),

  currentFlow: null,
  currentScreen: null,
  flowData: {},

  navigateToFlow: (flowId, screenId) => {
    set({
      currentFlow: flowId,
      currentScreen: screenId,
    });
  },

  setFlowData: (data) => {
    set((state) => ({
      flowData: { ...state.flowData, ...data },
    }));
  },

  resetFlowData: () => {
    set({
      flowData: {},
    });
  },

  resetFlow: () => {
    set({
      currentFlow: null,
      currentScreen: null,
      flowData: {},
    });
  },

  navigation: {
    isNavigate: false,
    navigateToPath: "",
    navigateParams: {},
  },

  setNavigation: (
    isNavigate: boolean,
    path?: string,
    params?: Record<string, any>
  ) => {
    set({
      navigation: {
        isNavigate: isNavigate,
        navigateToPath: path || "",
        navigateParams: params || {},
      },
    });
  },
}));
