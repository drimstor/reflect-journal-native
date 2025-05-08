import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { createStyles } from "./ChatScreen.styles";
import { Layout, useBottomSheetActions } from "@/src/shared/ui";
import { ChatView, Header } from "@/src/widgets";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  useThemeStore,
  useBottomSheetStore,
  useAppSelector,
  RootState,
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

const ChatScreen: FC = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const route = useRoute();
  const { item } = route.params as any;
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

  const { text, setText, handleSend, userId } = useMessageSender(
    item.id,
    resetFilters,
    messagesData?.data[0]._id
  );
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
        />
      </View>
    </Layout>
  );
};

export default ChatScreen;
