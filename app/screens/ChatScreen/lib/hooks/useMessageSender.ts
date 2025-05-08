import { useCallback, useState } from "react";
import { IMessage } from "react-native-gifted-chat";
import { GiftedChat } from "react-native-gifted-chat";
import {
  useCreateMessageMutation,
  useGetCurrentUserQuery,
} from "@/src/entities";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { useAppSelector } from "@/src/shared/store";
import { useAppDispatch } from "@/src/shared/store";
import { getMessagesEndpointParams } from "@/src/entities";
import { messagesApi } from "@/src/entities/chat/api/messagesApi";

export const useMessageSender = (
  chatId: string,
  resetFilters: () => void,
  lastMessageId?: string
) => {
  const dispatch = useAppDispatch();
  const endpointParams = useAppSelector(getMessagesEndpointParams(chatId));
  const { data: user } = useGetCurrentUserQuery();
  const [text, setText] = useState("");
  const [createMessage, { isLoading: isLoadingCreateMessage }] =
    useCreateMessageMutation();

  const handleSend = useCallback(
    (
      setMessages: React.Dispatch<React.SetStateAction<MessageGiftedChat[]>>
    ) => {
      if (!text.trim()) return;

      resetFilters();

      // Создаем сообщение пользователя
      const messageToSend: MessageGiftedChat = {
        _id: `${chatId}:${
          lastMessageId ? Number(lastMessageId.split(":")[1]) + 1 : 1
        }`,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        user: { _id: user?.id || "" },
      };

      dispatch(
        messagesApi.util.updateQueryData(
          "getChatMessages",
          endpointParams as never,
          (cachedData) => {
            cachedData.data.unshift(messageToSend);
            return cachedData;
          }
        )
      );

      // Добавляем сообщение пользователя в чат
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [messageToSend])
      );
      setText("");

      // Отправляем сообщение на сервер
      createMessage({
        chat_id: chatId,
        content: text.trim(),
      }).then((response) => {
        if ("data" in response && response.data) {
          const newMessage: MessageGiftedChat = {
            _id: response.data.id.toString(),
            text: response.data.content,
            createdAt: new Date(response.data.created_at).toISOString(),
            user: { _id: "assistant" },
          };

          dispatch(
            messagesApi.util.updateQueryData(
              "getChatMessages",
              endpointParams as never,
              (cachedData) => {
                cachedData.data.unshift(newMessage);
                return cachedData;
              }
            )
          );

          // Удаляем временный лоадер и добавляем ответ ассистента
          setMessages((previousMessages) => {
            const filteredMessages = previousMessages.filter(
              (msg) =>
                typeof msg._id === "string" && !msg._id.startsWith("temp-")
            );
            return GiftedChat.append(filteredMessages, [newMessage]);
          });
        }
      });

      // Добавляем временный лоадер для ответа ассистента
      setTimeout(() => {
        const tempMessage: MessageGiftedChat = {
          _id: `temp-${Date.now()}`,
          text: "",
          createdAt: "",
          user: { _id: "assistant" },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [tempMessage])
        );
      }, 800);
    },
    [text, user?.id, chatId, createMessage]
  );

  return {
    text,
    setText,
    isLoadingCreateMessage,
    handleSend,
    userId: user?.id || "",
  };
};
