import { baseApi } from "@/src/shared/api/baseApi";
import { formatValidationErrors } from "@/src/shared/store";
import type {
  Chat,
  CreateChatRequest,
  UpdateChatRequest,
  ChatResponse,
} from "../model/types";
import { Alert } from "react-native";
import { mergeQueryData } from "@/src/shared/store";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";

export const chatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<ChatResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/chats${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: ENTITY_NAME.CHAT,
                id,
              })),
              { type: ENTITY_NAME.CHAT, id: "LIST" },
            ]
          : [{ type: ENTITY_NAME.CHAT, id: "LIST" }],
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
    }),

    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (body) => ({
        url: "/chats/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: ENTITY_NAME.CHAT, id: "LIST" }],
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
          { type: ENTITY_NAME.CHAT, id },
          { type: ENTITY_NAME.CHAT, id: "LIST" },
        ],
      }
    ),

    deleteChat: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: ENTITY_NAME.CHAT, id },
        { type: ENTITY_NAME.CHAT, id: "LIST" },
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
