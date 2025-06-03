import { baseApi } from "@/src/shared/api/baseApi";
import {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageResponse,
  CreateAIMessageFromEntityRequest,
} from "../model/types";
import { transformMessages } from "../lib/helpers/transformMessages";
import { IMessage } from "react-native-gifted-chat";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";

export const MESSAGES_TAG = "Messages" as const;
type TagTypes = typeof MESSAGES_TAG;

// Расширенный тип для чата
interface ChatMessageResponse extends Omit<MessageResponse, "data"> {
  data: IMessage[];
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (data: CreateMessageRequest) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: ENTITY_PLURAL.CHAT, id: "LIST" },
        ...(data.chat_id
          ? [{ type: ENTITY_PLURAL.CHAT, id: data.chat_id }]
          : []),
      ],
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
        { type: ENTITY_PLURAL.CHAT, id: result?.chat_id },
        { type: ENTITY_PLURAL.CHAT, id: "LIST" },
      ],
    }),

    deleteMessage: builder.mutation<void, string>({
      query: (message_id: string) => ({
        url: `/messages/${message_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, message_id) => [
        { type: MESSAGES_TAG, id: message_id },
        { type: MESSAGES_TAG, id: "LIST" },
        { type: ENTITY_PLURAL.CHAT, id: "LIST" },
      ],
    }),

    // Создание AI-сообщения на основе сущности
    createAIMessageFromEntity: builder.mutation<
      Message,
      CreateAIMessageFromEntityRequest
    >({
      query: (data) => ({
        url: "/messages/ai-from-entity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: ENTITY_PLURAL.CHAT, id: "LIST" },
        { type: MESSAGES_TAG, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetChatMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useCreateAIMessageFromEntityMutation,
} = messagesApi;
