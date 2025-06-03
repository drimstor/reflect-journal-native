import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/shared/store";
import { getMessagesEndpointParams } from "@/src/entities";
import {
  messagesApi,
  useCreateAIMessageFromEntityMutation,
} from "@/src/entities/chat/api/messagesApi";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { normalizeGiftedChatDate } from "@/src/shared/lib/helpers/normalizeGiftedChatDate";

interface UseAssistantMessageProps {
  item: any;
  requestAssistantMessage: any;
  isLoadingMessages: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageGiftedChat[]>>;
}

export const useAssistantMessage = ({
  item,
  requestAssistantMessage,
  isLoadingMessages,
  setMessages,
}: UseAssistantMessageProps) => {
  const dispatch = useAppDispatch();
  const endpointParams = useAppSelector(getMessagesEndpointParams(item.id));
  const [createAIMessageFromEntity] = useCreateAIMessageFromEntityMutation();
  const [isHandled, setIsHandled] = useState(false);

  useEffect(() => {
    if (
      requestAssistantMessage?.source_type &&
      requestAssistantMessage?.source_id &&
      !isLoadingMessages
    ) {
      setIsHandled(false);
      createAIMessageFromEntity({
        source_type: requestAssistantMessage?.source_type,
        source_id: requestAssistantMessage?.source_id,
        chatId: item.id,
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
              (cachedData: any) => {
                cachedData.data.unshift(newMessage as unknown as IMessage);
                return cachedData;
              }
            )
          );

          setMessages((previousMessages) => {
            const filteredMessages = previousMessages.filter(
              (msg) =>
                typeof msg._id === "string" && !msg._id.startsWith("temp-")
            );
            // Приводим к IMessage для GiftedChat.append
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
            // Возвращаем обратно MessageGiftedChat (createdAt: string)
            return appended.map((msg) => ({
              ...msg,
              createdAt: normalizeGiftedChatDate(msg.createdAt),
            })) as MessageGiftedChat[];
          });
          setIsHandled(true);
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
    } else {
      setIsHandled(false);
    }
  }, [requestAssistantMessage, isLoadingMessages]);

  return { isHandled };
};
