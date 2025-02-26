import { PATHS } from "@/src/shared/const";
import {
  AuthScreen,
  HomeScreen,
  LibraryScreen,
  LibraryItemScreen,
  ChatScreen,
  LibraryListScreen,
} from "@/app/screens";

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
];
