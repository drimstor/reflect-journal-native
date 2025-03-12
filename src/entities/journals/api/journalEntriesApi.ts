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

export const JOURNAL_ENTRIES_TAG = "JournalEntries" as const;
type TagTypes = typeof JOURNAL_ENTRIES_TAG;

export const journalEntriesApi = createApi({
  reducerPath: "journalEntriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [JOURNAL_ENTRIES_TAG],
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
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
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
