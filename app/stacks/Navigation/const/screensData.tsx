import {
  AuthScreen,
  ChartsScreen,
  ChatScreen,
  CreateEntityScreen,
  HomeScreen,
  LibraryItemScreen,
  LibraryListScreen,
  LibraryScreen,
  RelationshipMapScreen,
  SettingsAssistantScreen,
  SettingsGrowthScreen,
  SettingsLanguageScreen,
  SettingsNotificationsScreen,
  SettingsSubscriptionScreen,
  TestScreen,
} from "@/app/screens";
import { PATHS } from "@/src/shared/const";

export const screensData = [
  { name: PATHS.HOME, component: HomeScreen, options: { animation: "none" } },
  {
    name: PATHS.LIBRARY,
    component: LibraryScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.LIBRARY_ITEM,
    component: LibraryItemScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.AUTH,
    component: AuthScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.CHAT,
    component: ChatScreen,
    options: { animation: "default" },
  },
  {
    name: PATHS.LIBRARY_LIST,
    component: LibraryListScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.ADD_ENTRY,
    component: CreateEntityScreen,
    options: { presentation: "modal" },
  },
  {
    name: PATHS.RELATIONSHIP_MAP,
    component: RelationshipMapScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.CHARTS,
    component: ChartsScreen,
    options: { animation: "none" },
  },
  {
    name: PATHS.TEST,
    component: TestScreen,
    options: { animation: "default" },
  },
  {
    name: PATHS.SETTINGS_ASSISTANT,
    component: SettingsAssistantScreen,
    options: { animation: "simple_push" },
  },
  {
    name: PATHS.SETTINGS_DEVELOP,
    component: SettingsGrowthScreen,
    options: { animation: "simple_push" },
  },
  {
    name: PATHS.SETTINGS_NOTIFICATIONS,
    component: SettingsNotificationsScreen,
    options: { animation: "simple_push" },
  },
  {
    name: PATHS.SETTINGS_LANGUAGE,
    component: SettingsLanguageScreen,
    options: { animation: "simple_push" },
  },
  {
    name: PATHS.SETTINGS_SUBSCRIPTION,
    component: SettingsSubscriptionScreen,
    options: { animation: "simple_push" },
  },
];
