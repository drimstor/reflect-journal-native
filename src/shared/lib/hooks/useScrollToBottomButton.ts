import { useCallback, useRef } from "react";

export const useScrollToBottomButton = () => {
  // Реф для скролла к низу
  const messageContainerRef = useRef<any>(null);

  // Функция для скролла к началу (новые сообщения)
  const scrollToBottom = useCallback(() => {
    messageContainerRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return {
    messageContainerRef,
    scrollToBottom,
  };
};
