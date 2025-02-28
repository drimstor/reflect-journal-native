import {
  baseQueryWithReauth,
  formatValidationErrors,
} from "@/src/shared/store";
import type {
  Journal,
  CreateJournalRequest,
  UpdateJournalRequest,
  JournalResponse,
} from "../model/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";

export const JOURNALS_TAG = "Journals" as const;
type TagTypes = typeof JOURNALS_TAG;

export const journalsApi = createApi({
  reducerPath: "journalsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [JOURNALS_TAG],
  endpoints: (builder) => ({
    getJournals: builder.query<JournalResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/journals${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: JOURNALS_TAG, id })),
              { type: JOURNALS_TAG, id: "LIST" },
            ]
          : [{ type: JOURNALS_TAG, id: "LIST" }],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Если есть дополнительные фильтры (кроме page и limit), не используем кеширование
        const params = new URLSearchParams(queryArgs.params || "");
        const hasOnlyPagination = Array.from(params.keys()).every(
          (key) => key === "page" || key === "limit"
        );

        // Для запросов с фильтрами генерируем уникальный ключ
        return hasOnlyPagination
          ? endpointName
          : `${endpointName}-${queryArgs.params}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // Если есть фильтры, возвращаем только новые данные
        const params = new URLSearchParams(arg.params || "");
        const hasOnlyPagination = Array.from(params.keys()).every(
          (key) => key === "page" || key === "limit"
        );

        if (!hasOnlyPagination) {
          return newItems;
        }

        // Для базового запроса с пагинацией мерджим данные
        if (currentCache) {
          const existingIds = new Set(currentCache.data.map((item) => item.id));
          const uniqueNewItems = newItems.data.filter(
            (item) => !existingIds.has(item.id)
          );

          return {
            ...newItems,
            data: [...currentCache.data, ...uniqueNewItems],
          };
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    createJournal: builder.mutation<Journal, CreateJournalRequest>({
      query: (body) => ({
        url: "/journals/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: JOURNALS_TAG, id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data?.detail) ||
              "Не удалось создать журнал"
          );
        }
      },
    }),

    updateJournal: builder.mutation<
      Journal,
      { id: string; body: UpdateJournalRequest }
    >({
      query: ({ id, body }) => ({
        url: `/journals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: JOURNALS_TAG, id },
        { type: JOURNALS_TAG, id: "LIST" },
      ],
    }),

    deleteJournal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: JOURNALS_TAG, id },
        { type: JOURNALS_TAG, id: "LIST" },
      ],
    }),
  }),
  // overrideExisting: false,
});

export const {
  useGetJournalsQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
} = journalsApi;
