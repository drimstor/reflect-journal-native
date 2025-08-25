import { PATHS } from "@/src/shared/const";

// Маппинг путей к названиям экранов для автоматической установки screenInfo
export const SCREEN_NAMES: Record<string, string> = {
  [PATHS.HOME]: "Home",
  [PATHS.ADD_ENTRY]: "CreateEntity",
  [PATHS.OVERVIEW]: "Overview",
  [PATHS.PROFILE]: "Settings",
  [PATHS.AUTH]: "Auth",
  [PATHS.CHAT]: "Chat",
  [PATHS.RELATIONSHIP_MAP]: "Relationship Map",
  [PATHS.CHARTS]: "Charts",
  // [PATHS.LIBRARY]: "Library",
  // [PATHS.LIBRARY_LIST]: "Library List",
  // [PATHS.LIBRARY_ITEM]: "Library Item",
  // [PATHS.TEST]: "Test",
};
