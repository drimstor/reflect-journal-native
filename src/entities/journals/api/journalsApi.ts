import { baseApi } from "@/src/shared/api/baseApi";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { formatValidationErrors, mergeQueryData } from "@/src/shared/store";
import { Alert } from "react-native";
import type {
  CreateJournalRequest,
  Journal,
  JournalResponse,
  UpdateJournalRequest,
} from "../model/types";

export const journalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJournals: builder.query<JournalResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/journals${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: ENTITY_NAME.JOURNALS,
                id,
              })),
              { type: ENTITY_NAME.JOURNALS, id: "LIST" },
            ]
          : [{ type: ENTITY_NAME.JOURNALS, id: "LIST" }],
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
        return mergeQueryData(currentCache, newItems, arg.params);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      // Принудительное обновление кеша при создании новых записей через entry подписки
      extraOptions: {
        maxRetries: 0, // Отключаем автоматические повторные запросы при ошибках
      },
    }),

    getJournal: builder.query<Journal, { id: string }>({
      query: ({ id }) => ({
        url: `/journals/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [
        { type: ENTITY_NAME.JOURNALS, id },
      ],
    }),

    createJournal: builder.mutation<Journal, CreateJournalRequest>({
      query: (body) => ({
        url: "/journals/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: ENTITY_NAME.JOURNALS, id: "LIST" }],
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
        { type: ENTITY_NAME.JOURNALS, id },
        { type: ENTITY_NAME.JOURNALS, id: "LIST" },
      ],
    }),

    deleteJournal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: ENTITY_NAME.JOURNALS, id },
        { type: ENTITY_NAME.JOURNALS, id: "LIST" },
      ],
    }),
  }),
});

// Необходимо для активации подписки на изменения записей в дневниках
export const journalsApiUtil = journalsApi.util;

export const {
  useGetJournalsQuery,
  useGetJournalQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
} = journalsApi;
