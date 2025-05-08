import {
  baseQueryWithReauth,
  formatValidationErrors,
} from "@/src/shared/store";
import type {
  JournalEntry,
  JournalEntryResponse,
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
} from "../model/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";
import { mergeQueryData } from "@/src/shared/store";
import { JOURNALS_TAG, journalsApiUtil } from "./journalsApi";

export const JOURNAL_ENTRIES_TAG = "JournalEntries" as const;
type TagTypes = typeof JOURNAL_ENTRIES_TAG;

export const journalEntriesApi = createApi({
  reducerPath: "journalEntriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [JOURNAL_ENTRIES_TAG, JOURNALS_TAG],
  endpoints: (builder) => ({
    getJournalEntries: builder.query<JournalEntryResponse, { params?: string }>(
      {
        query: ({ params }) => ({
          url: `/journal-entries${params ? `?${params}` : ""}`,
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({
                  type: JOURNAL_ENTRIES_TAG,
                  id,
                })),
                { type: JOURNAL_ENTRIES_TAG, id: "LIST" },
              ]
            : [{ type: JOURNAL_ENTRIES_TAG, id: "LIST" }],
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          const params = new URLSearchParams(queryArgs.params || "");
          const hasOnlyPagination = Array.from(params.keys()).every(
            (key) => key === "page" || key === "limit"
          );

          return hasOnlyPagination
            ? endpointName
            : `${endpointName}-${queryArgs.params}`;
        },
        merge: (currentCache, newItems, { arg }) => {
          return mergeQueryData(currentCache, newItems, arg.params);
        },
        forceRefetch({ currentArg, previousArg }) {
          return currentArg !== previousArg;
        },
      }
    ),

    searchEntries: builder.query<
      JournalEntry[],
      { query: string; journal_id?: string }
    >({
      query: ({ query, journal_id }) => ({
        url: "/journal-entries/search",
        method: "GET",
        params: { query, journal_id },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: JOURNAL_ENTRIES_TAG, id })),
              { type: JOURNAL_ENTRIES_TAG, id: "SEARCH" },
            ]
          : [{ type: JOURNAL_ENTRIES_TAG, id: "SEARCH" }],
    }),

    createJournalEntry: builder.mutation<
      JournalEntry,
      CreateJournalEntryRequest
    >({
      query: (body) => ({
        url: "/journal-entries/create",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [
        { type: JOURNAL_ENTRIES_TAG, id: "LIST" },
        { type: JOURNAL_ENTRIES_TAG, id: "SEARCH" },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Принудительно обновляем список дневников после создания новой записи
          dispatch(
            journalsApiUtil.invalidateTags([{ type: JOURNALS_TAG, id: "LIST" }])
          );

          // Если указан journal_id, также принудительно обновляем конкретный дневник
          if (body.journal_id) {
            dispatch(
              journalsApiUtil.invalidateTags([
                { type: JOURNALS_TAG, id: body.journal_id },
              ])
            );
          }
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data) ||
              "Не удалось создать запись"
          );
        }
      },
    }),

    updateJournalEntry: builder.mutation<
      JournalEntry,
      { id: string; body: UpdateJournalEntryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/journal-entries/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: JOURNAL_ENTRIES_TAG, id },
        { type: JOURNAL_ENTRIES_TAG, id: "LIST" },
        { type: JOURNAL_ENTRIES_TAG, id: "SEARCH" },
      ],
      // Если изменена запись, нужно обновить и журнал
      async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Если у записи есть journal_id, обновляем также дневник
          if (data && data.journal_id) {
            dispatch(
              journalsApiUtil.invalidateTags([
                { type: JOURNALS_TAG, id: data.journal_id },
                { type: JOURNALS_TAG, id: "LIST" },
              ])
            );
          }
        } catch (error) {
          // Игнорируем ошибки
        }
      },
    }),

    deleteJournalEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journal-entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: JOURNAL_ENTRIES_TAG, id },
        { type: JOURNAL_ENTRIES_TAG, id: "LIST" },
        { type: JOURNAL_ENTRIES_TAG, id: "SEARCH" },
      ],
      // При удалении записи также обновляем список дневников
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Принудительно обновляем список дневников
          dispatch(
            journalsApiUtil.invalidateTags([{ type: JOURNALS_TAG, id: "LIST" }])
          );
        } catch (error) {
          // Игнорируем ошибки
        }
      },
    }),
  }),
});

export const {
  useGetJournalEntriesQuery,
  useSearchEntriesQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
} = journalEntriesApi;
