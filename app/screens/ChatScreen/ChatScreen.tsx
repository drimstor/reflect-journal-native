import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { createStyles } from "./ChatScreen.styles";
import { Layout, useBottomSheetActions } from "@/src/shared/ui";
import { ChatView, Header } from "@/src/widgets";
import {
  useThemeStore,
  useBottomSheetStore,
  useAppSelector,
} from "@/src/shared/store";
import { ChatBackground } from "@/src/features";
import { useRoute } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const/PATHS";
import {
  useDateChip,
  useMessagesLoader,
  useMessageSender,
  useLongPressActions,
} from "./lib/hooks";
import { DotsIcon } from "@/src/shared/ui/icons";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { getMessagesCache } from "@/src/entities";
import { useAssistantMessage } from "./lib/hooks/useAssistantMessage";

const ChatScreen: FC = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const route = useRoute();
  let { item, requestAssistantMessage } = route.params as any;
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
  const { handlePress: handlePressDots } = useBottomSheetActions("Chats", item);

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
    requestAssistantMessage,
    isLoadingMessages,
    setMessages,
  });

  useEffect(() => {
    if (isHandled) requestAssistantMessage = null;
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
          handleSend={handleSend}
          handleLongPress={handleLongPress}
          currentDate={currentDate}
          chipAnimation={chipAnimation}
          handleScroll={handleScroll}
          userId={userId}
          isCanBeEmpty={!requestAssistantMessage?.source_id}
        />
      </View>
    </Layout>
  );
};

export default ChatScreen;
