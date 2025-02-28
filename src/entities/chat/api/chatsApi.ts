import {
  baseQueryWithReauth,
  formatValidationErrors,
} from "@/src/shared/store";
import type {
  Chat,
  CreateChatRequest,
  UpdateChatRequest,
  ChatResponse,
} from "../model/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";

export const CHATS_TAG = "Chats" as const;
type TagTypes = typeof CHATS_TAG;

export const chatsApi = createApi({
  reducerPath: "chatsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [CHATS_TAG],
  endpoints: (builder) => ({
    getChats: builder.query<ChatResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/chats${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: CHATS_TAG, id })),
              { type: CHATS_TAG, id: "LIST" },
            ]
          : [{ type: CHATS_TAG, id: "LIST" }],
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

    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (body) => ({
        url: "/chats/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: CHATS_TAG, id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data?.detail) ||
              "Не удалось создать чат"
          );
        }
      },
    }),

    updateChat: builder.mutation<Chat, { id: string; body: UpdateChatRequest }>(
      {
        query: ({ id, body }) => ({
          url: `/chats/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: CHATS_TAG, id },
          { type: CHATS_TAG, id: "LIST" },
        ],
      }
    ),

    deleteChat: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: CHATS_TAG, id },
        { type: CHATS_TAG, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useDeleteChatMutation,
} = chatsApi;
