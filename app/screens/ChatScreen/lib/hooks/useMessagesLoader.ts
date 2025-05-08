import { useCallback, useState } from "react";
import { useGetChatMessagesQuery } from "@/src/entities";

export const useMessagesLoader = (chatId: string) => {
  const [page, setPage] = useState(1);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);

  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetChatMessagesQuery({
      chat_id: chatId,
      limit: 20,
      page,
    });

  const handleLoadEarlier = useCallback(async () => {
    if (isLoadingEarlier) return;

    setIsLoadingEarlier(true);
    try {
      setPage(page + 1);
    } catch (error) {
      console.error("Error loading earlier messages:", error);
    } finally {
      setIsLoadingEarlier(false);
    }
  }, [page, isLoadingEarlier]);

  const resetFilters = useCallback(() => {
    setPage(1);
  }, []);

  return {
    isLoadingMessages,
    isLoadingEarlier,
    page,
    handleLoadEarlier,
    messagesData,
    resetFilters,
  };
};
