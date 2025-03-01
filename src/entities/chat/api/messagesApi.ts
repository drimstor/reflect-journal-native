import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/shared/store";
import {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageResponse,
} from "../model/types";

export const MESSAGES_TAG = "Messages" as const;
type TagTypes = typeof MESSAGES_TAG;

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [MESSAGES_TAG],
  endpoints: (builder) => ({
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (data: CreateMessageRequest) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: MESSAGES_TAG, id: "LIST" }],
    }),

    getChatMessages: builder.query<
      MessageResponse,
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
              ...result.data.map(({ id }) => ({ type: MESSAGES_TAG, id })),
              { type: MESSAGES_TAG, id: "LIST" },
            ]
          : [{ type: MESSAGES_TAG, id: "LIST" }],
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
      ],
    }),

    deleteMessage: builder.mutation<void, string>({
      query: (message_id: string) => ({
        url: `/messages/${message_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, message_id) => [
        { type: MESSAGES_TAG, id: message_id },
      ],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetChatMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
