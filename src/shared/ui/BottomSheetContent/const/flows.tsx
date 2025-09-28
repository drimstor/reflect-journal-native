import { ComponentType, LazyExoticComponent, lazy } from "react";

import BottomSheetList from "@/src/shared/ui/BottomSheetContent/ui/BottomSheetList/BottomSheetList";

export type ScreenComponent =
  | LazyExoticComponent<ComponentType<any>>
  | ComponentType<any>;

export interface FlowConfig {
  screens: Record<string, ScreenComponent>;
}

export const FLOWS: Record<string, FlowConfig> = {
  common: {
    screens: {
      list: BottomSheetList,
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
      pickerPeriod: lazy(
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
  goal: {
    screens: {
      create: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/CreateGoalView/CreateGoalView"
          )
      ),
    },
  },
  summary: {
    screens: {
      create: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/CreateSummaryView/CreateSummaryViewWithDatePicker"
          )
      ),
    },
  },
  test: {
    screens: {
      skip: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/SkipQuestionView/SkipQuestionView"
          )
      ),
      exit: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/ExitTestView/ExitTestView"
          )
      ),
    },
  },
  adviceFilter: {
    screens: {
      categories: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/FilterAdviceCategoriesView/FilterAdviceCategoriesView"
          )
      ),
    },
  },
  profile: {
    screens: {
      edit: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/EditProfileView/EditProfileView"
          )
      ),
      deleteAvatar: lazy(
        () =>
          import(
            "@/src/features/bottom-sheet-content/DeleteAvatarView/DeleteAvatarView"
          )
      ),
    },
  },
};
