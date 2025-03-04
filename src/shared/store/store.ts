import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../api/baseApi";
import { uiSlice } from "./";
import {
  authApi,
  chatsApi,
  journalsApi,
  goalsApi,
  summaryApi,
  journalEntriesApi,
  messagesApi,
} from "@/src/entities";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [journalsApi.reducerPath]: journalsApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
    [summaryApi.reducerPath]: summaryApi.reducer,
    [journalEntriesApi.reducerPath]: journalEntriesApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authApi.middleware)
      .concat(journalsApi.middleware)
      .concat(chatsApi.middleware)
      .concat(goalsApi.middleware)
      .concat(summaryApi.middleware)
      .concat(journalEntriesApi.middleware)
      .concat(messagesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
