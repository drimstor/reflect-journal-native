import {
  getMessagesEndpointParams,
  useCreateMessageWithImagesMutation,
  useGetCurrentUserQuery,
} from "@/src/entities";
import { messagesApi } from "@/src/entities/chat/api/messagesApi";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { normalizeGiftedChatDate } from "@/src/shared/lib/helpers/normalizeGiftedChatDate";
import { ImagePickerResult } from "@/src/shared/lib/hooks/useImagePicker";
import { useAppDispatch, useAppSelector } from "@/src/shared/store";
import { useCallback, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export const useMessageSender = ({
  chatId,
  resetFilters,
  lastMessageId,
  setMessages,
}: {
  chatId: string;
  resetFilters: () => void;
  lastMessageId?: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageGiftedChat[]>>;
}) => {
  const dispatch = useAppDispatch();
  const endpointParams = useAppSelector(getMessagesEndpointParams(chatId));
  const { data: user } = useGetCurrentUserQuery();
  const [text, setText] = useState("");
  const [createMessageWithImages, { isLoading: isLoadingCreateMessage }] =
    useCreateMessageWithImagesMutation();

  const handleSend = useCallback(
    (images?: ImagePickerResult[]) => {
      if (!text.trim() && (!images || images.length === 0)) return;

      resetFilters();

      // Создаем сообщение пользователя
      const messageToSend: MessageGiftedChat = {
        _id: `${chatId}:${
          lastMessageId ? Number(lastMessageId.split(":")[1]) + 1 : 1
        }`,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        user: { _id: user?.id || "" },
        // Добавляем временные URI изображений для показа в UI
        images:
          images && images.length > 0
            ? images.map((img) => img.uri)
            : undefined,
      };

      // Добавляем сообщение пользователя в кеш
      dispatch(
        messagesApi.util.updateQueryData(
          "getChatMessages",
          endpointParams as never,
          (cachedData) => {
            cachedData.data.unshift(messageToSend as unknown as IMessage);
            return cachedData;
          }
        )
      );

      // Добавляем сообщение пользователя в чат
      setMessages((previousMessages) => {
        const prevIMessage = previousMessages.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        })) as IMessage[];
        const appended = GiftedChat.append(prevIMessage, [
          {
            ...messageToSend,
            createdAt: new Date(messageToSend.createdAt),
          } as IMessage,
        ]) as IMessage[];
        return appended.map((msg) => ({
          ...msg,
          createdAt: normalizeGiftedChatDate(msg.createdAt),
        })) as MessageGiftedChat[];
      });
      setText("");

      // Функция для создания FormData (всегда используем FormData)
      const createFormData = (
        content: string,
        imageFiles?: ImagePickerResult[]
      ): FormData => {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("chat_id", chatId);

        if (imageFiles && imageFiles.length > 0) {
          imageFiles.forEach((image, index) => {
            formData.append("images", {
              uri: image.uri,
              name: image.fileName,
              type: image.type,
            } as any);
          });
        }

        return formData;
      };

      // Всегда отправляем через FormData
      const sendRequest = createMessageWithImages(
        createFormData(text.trim(), images)
      );

      sendRequest.then((response) => {
        if ("data" in response && response.data) {
          const newMessage: MessageGiftedChat = {
            _id: response.data.id.toString(),
            text: response.data.content,
            createdAt: new Date(response.data.created_at).toISOString(),
            user: { _id: "assistant" },
            command: response.data.command,
            images: response.data.images,
          };

          dispatch(
            messagesApi.util.updateQueryData(
              "getChatMessages",
              endpointParams as never,
              (cachedData) => {
                cachedData.data.unshift(newMessage as unknown as IMessage);
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
            const filteredIMessage = filteredMessages.map((msg) => ({
              ...msg,
              createdAt: new Date(msg.createdAt),
            })) as IMessage[];
            const appended = GiftedChat.append(filteredIMessage, [
              {
                ...newMessage,
                createdAt: new Date(newMessage.createdAt),
              } as IMessage,
            ]) as IMessage[];
            return appended.map((msg) => ({
              ...msg,
              createdAt: normalizeGiftedChatDate(msg.createdAt),
            })) as MessageGiftedChat[];
          });
        }
      });

      // Добавляем временный лоадер для ответа ассистента
      setTimeout(() => {
        const tempMessage: IMessage = {
          _id: `temp-${Date.now()}`,
          text: "",
          createdAt: new Date(),
          user: { _id: "assistant" },
        };
        setMessages((previousMessages) => {
          const prevIMessage = previousMessages.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })) as IMessage[];
          const appended = GiftedChat.append(prevIMessage, [
            tempMessage,
          ]) as IMessage[];
          return appended.map((msg) => ({
            ...msg,
            createdAt: normalizeGiftedChatDate(msg.createdAt),
          })) as MessageGiftedChat[];
        });
      }, 800);
    },
    [text, user?.id, chatId, createMessageWithImages]
  );

  return {
    text,
    setText,
    isLoadingCreateMessage,
    handleSend,
    userId: user?.id || "",
  };
};
