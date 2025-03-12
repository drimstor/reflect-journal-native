import { ComponentType, LazyExoticComponent, lazy } from "react";

export type ScreenComponent = LazyExoticComponent<ComponentType<any>>;

export interface FlowConfig {
  screens: Record<string, ScreenComponent>;
}

export const FLOWS: Record<string, FlowConfig> = {
  main: {
    screens: {
      actionsList: lazy(
        () =>
          import(
            "@/src/shared/ui/BottomSheetContent/ui/BottomSheetList/BottomSheetList"
          )
      ),
      edit: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/EditEntityView/EditEntityView"
          )
      ),
      delete: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DeleteEntityView/DeleteEntityView"
          )
      ),
      success: lazy(
        () =>
          import("@/src/features/bottom-sheet-content/SuccessView/SuccessView")
      ),
    },
  },
};
