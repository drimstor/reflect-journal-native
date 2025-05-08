import { ComponentType, LazyExoticComponent, lazy } from "react";

export type ScreenComponent = LazyExoticComponent<ComponentType<any>>;

export interface FlowConfig {
  screens: Record<string, ScreenComponent>;
}

export const FLOWS: Record<string, FlowConfig> = {
  common: {
    screens: {
      list: lazy(
        () =>
          import(
            "@/src/shared/ui/BottomSheetContent/ui/BottomSheetList/BottomSheetList"
          )
      ),
      success: lazy(
        () =>
          import("@/src/features/bottom-sheet-content/SuccessView/SuccessView")
      ),
    },
  },
  main: {
    screens: {
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
    },
  },
  chat: {
    screens: {
      edit: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/EditMessageView/EditMessageView"
          )
      ),
      delete: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DeleteMessageView/DeleteMessageView"
          )
      ),
    },
  },
  multiSelect: {
    screens: {
      delete: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DeleteEntitiesView/DeleteEntitiesView"
          )
      ),
      bookmarked: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/BookmarkedEntitiesView/BookmarkedEntitiesView"
          )
      ),
    },
  },
  date: {
    screens: {
      list: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DatePickerListView/DatePickerListView"
          )
      ),
      picker: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DatePickerEntityView/DatePickerEntityView"
          )
      ),
    },
  },
  sort: {
    screens: {
      list: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/SortEntityView/SortEntityView"
          )
      ),
    },
  },
  filter: {
    screens: {
      list: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/FilterEntityView/FilterEntityView"
          )
      ),
    },
  },
  logout: {
    screens: {
      areYouSure: lazy(
        () =>
          import("@/src/features/bottom-sheet-content/LogoutView/LogoutView")
      ),
    },
  },
};
