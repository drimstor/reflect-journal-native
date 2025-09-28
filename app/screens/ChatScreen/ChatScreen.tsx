import { getMessagesCache } from "@/src/entities";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { ChatBackground } from "@/src/features";
import { PATHS } from "@/src/shared/const/PATHS";
import { useScrollToBottomButton } from "@/src/shared/lib/hooks";
import { ImagePickerResult } from "@/src/shared/lib/hooks/useImagePicker";
import {
  useAppSelector,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import { Layout, useBottomSheetActions } from "@/src/shared/ui";
import { DotsIcon } from "@/src/shared/ui/icons";
import { ChatView, Header } from "@/src/widgets";
import { useRoute } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { createStyles } from "./ChatScreen.styles";
import {
  useDateChip,
  useLongPressActions,
  useMessageSender,
  useMessagesLoader,
} from "./lib/hooks";
import { useAssistantMessage } from "./lib/hooks/useAssistantMessage";

const ChatScreen: FC = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const route = useRoute();
  const { item, requestAssistantMessage: initialRequestAssistantMessage } =
    route.params as any;

  const requestAssistantMessageRef = useRef(initialRequestAssistantMessage);
  const { setNavigation } = useBottomSheetStore();

  // Состояние сообщений
  const [messages, setMessages] = useState<MessageGiftedChat[]>([]);

  // Используем кастомные хуки
  const {
    messagesData,
    isLoadingMessages,
    isLoadingEarlier,
    handleLoadEarlier,
    resetFilters,
  } = useMessagesLoader(item.id);

  const { text, setText, handleSend, userId } = useMessageSender({
    chatId: item.id,
    resetFilters,
    lastMessageId: messagesData?.data[0]?._id as string,
    setMessages,
  });
  const { handleLongPress } = useLongPressActions(item.id);
  const { currentDate, chipAnimation, handleScroll } = useDateChip(messages);
  const { messageContainerRef, scrollToBottom } = useScrollToBottomButton();
  const { handlePress: handlePressDots } = useBottomSheetActions("Chats", item);

  const handleSendMiddleware = useCallback(
    (images?: ImagePickerResult[]) => {
      handleSend(images);
      scrollToBottom();
    },
    [handleSend, scrollToBottom]
  );

  // Кеш сообщений
  const messagesCacheData = useAppSelector(getMessagesCache(item.id));

  // Обновление: добавляем только новые сообщения
  useEffect(() => {
    if (messagesCacheData?.data) {
      setMessages(messagesCacheData?.data);
    }
  }, [messagesCacheData?.data]);

  // Эффект для настройки навигации
  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [setNavigation]);

  const { isHandled } = useAssistantMessage({
    item,
    requestAssistantMessage: requestAssistantMessageRef.current,
    isLoadingMessages,
    setMessages,
  });

  useEffect(() => {
    if (isHandled) {
      requestAssistantMessageRef.current = null;
    }
  }, [isHandled]);

  return (
    <Layout style={{ flex: 1 }}>
      <ChatBackground />
      <Header
        title={item.name}
        backButton
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} />,
          onPress: handlePressDots,
        }}
      />
      <View style={styles.globalBox}>
        <ChatView
          item={item}
          messages={messages}
          setMessages={setMessages}
          messagesData={messagesData}
          isLoadingMessages={isLoadingMessages}
          isLoadingEarlier={isLoadingEarlier}
          handleLoadEarlier={handleLoadEarlier}
          text={text}
          setText={setText}
          handleSend={handleSendMiddleware}
          onQuickReply={handleLongPress}
          currentDate={currentDate}
          chipAnimation={chipAnimation}
          handleScroll={handleScroll}
          userId={userId}
          isCanBeEmpty={!requestAssistantMessageRef.current?.source_id}
          scrollToBottom={scrollToBottom}
          messageContainerRef={messageContainerRef}
        />
      </View>
    </Layout>
  );
};

export default ChatScreen;
