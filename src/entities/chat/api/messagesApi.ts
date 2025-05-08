import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/shared/store";
import {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageResponse,
} from "../model/types";
import { transformMessages } from "../lib/helpers/transformMessages";
import { IMessage } from "react-native-gifted-chat";
import { CHATS_TAG, chatsApi } from "./chatsApi";

export const MESSAGES_TAG = "Messages" as const;
type TagTypes = typeof MESSAGES_TAG;

// Экспортируем util чатов для инвалидации тегов
export const chatsApiUtil = chatsApi.util;

// Расширенный тип для чата
interface ChatMessageResponse extends Omit<MessageResponse, "data"> {
  data: IMessage[];
}

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [MESSAGES_TAG, CHATS_TAG],
  endpoints: (builder) => ({
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (data: CreateMessageRequest) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Инвалидируем список чатов при создании нового сообщения
          dispatch(
            chatsApiUtil.invalidateTags([{ type: CHATS_TAG, id: "LIST" }])
          );

          // Если указан chat_id, также инвалидируем конкретный чат
          if (data.chat_id) {
            dispatch(
              chatsApiUtil.invalidateTags([
                { type: CHATS_TAG, id: data.chat_id },
              ])
            );
          }
        } catch (error) {
          // Игнорируем ошибки
        }
      },
    }),

    getChatMessages: builder.query<
      ChatMessageResponse,
      { chat_id: string; limit?: number; page?: number }
    >({
      query: ({ chat_id, limit = 20, page = 1 }) => ({
        url: "/messages",
        method: "GET",
        params: { chat_id, limit, page },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((msg) => ({
                type: MESSAGES_TAG,
                id: msg._id.toString(),
              })),
              { type: MESSAGES_TAG, id: "LIST" },
            ]
          : [{ type: MESSAGES_TAG, id: "LIST" }],
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.chat_id}`,
      merge: (currentCache, newItems) => {
        // Если кеша нет, просто возвращаем новые данные
        if (!currentCache) {
          return newItems;
        }

        // Создаем Map для хранения уникальных сообщений, где ключ - _id сообщения
        const uniqueMessages = new Map<string, IMessage>();

        // Добавляем существующие сообщения из кеша в Map
        currentCache.data.forEach((msg) =>
          uniqueMessages.set(msg._id.toString(), msg)
        );

        // Добавляем или обновляем элементы из новых данных
        newItems.data.forEach((msg) =>
          uniqueMessages.set(msg._id.toString(), msg)
        );

        // Возвращаем обновленный объект с объединенными данными
        return {
          ...newItems,
          data: Array.from(uniqueMessages.values()),
        };
      },
      transformResponse: (response: MessageResponse): ChatMessageResponse => {
        return {
          ...response,
          data: transformMessages(response.data),
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page &&
          previousArg?.page !== undefined
        );
      },
    }),

    updateMessage: builder.mutation<
      Message,
      { message_id: string; data: UpdateMessageRequest }
    >({
      query: ({
        message_id,
        data,
      }: {
        message_id: string;
        data: UpdateMessageRequest;
      }) => ({
        url: `/messages/${message_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { message_id }) => [
        { type: MESSAGES_TAG, id: message_id },
        { type: MESSAGES_TAG, id: "LIST" },
      ],
      async onQueryStarted({ data }, { dispatch, queryFulfilled }) {
        try {
          const { data: responseData } = await queryFulfilled;

          // Если у сообщения есть chat_id, обновляем также чат
          if (responseData && responseData.chat_id) {
            dispatch(
              chatsApiUtil.invalidateTags([
                { type: CHATS_TAG, id: responseData.chat_id },
                { type: CHATS_TAG, id: "LIST" },
              ])
            );
          }
        } catch (error) {
          // Игнорируем ошибки
        }
      },
    }),

    deleteMessage: builder.mutation<void, string>({
      query: (message_id: string) => ({
        url: `/messages/${message_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, message_id) => [
        { type: MESSAGES_TAG, id: message_id },
        { type: MESSAGES_TAG, id: "LIST" },
      ],
      // При удалении сообщения также обновляем список чатов
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Принудительно обновляем список чатов
          dispatch(
            chatsApiUtil.invalidateTags([{ type: CHATS_TAG, id: "LIST" }])
          );
        } catch (error) {
          // Игнорируем ошибки
        }
      },
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetChatMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
