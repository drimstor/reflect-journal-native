import { RootState } from "@/src/shared/store";
import { MessagesGiftedChat } from "./types";

// Селектор для получения кеша сообщений чата
export const getMessagesCache = (chatId: string) => (state: RootState) =>
  state.messagesApi.queries?.[`getChatMessages-${chatId}`]
    ?.data as MessagesGiftedChat;

// Селектор для получения параметров запроса сообщений
export const getMessagesEndpointParams =
  (chatId: string) => (state: RootState) =>
    state.messagesApi.queries?.[`getChatMessages-${chatId}`]?.originalArgs;
