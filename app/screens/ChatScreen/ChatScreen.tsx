import React, {
  FC,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { View } from "react-native";
import { createStyles } from "./ChatScreen.styles";
import { Layout } from "@/src/shared/ui";
import { BottomSheetActions, Header } from "@/src/widgets";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  useDeviceStore,
  useThemeStore,
  useChatStore,
} from "@/src/shared/store";
import { MOCK_CHAT_MESSAGES } from "./const/static";
import {
  DateChip,
  Message,
  MessageInput,
  ChatBackground,
} from "@/src/features";
import { useDateChip } from "./lib/hooks/useDateChip";
import { useKeyboard } from "@/src/shared/lib/hooks/useKeyboard";
import * as Haptics from "expo-haptics";
import { Portal } from "@gorhom/portal";
import type { BottomSheetRef } from "@/src/shared/ui";
import {
  ClipboardTextIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import type { BottomSheetAction } from "@/src/widgets";

const ChatScreen: FC = () => {
  const { colors } = useThemeStore();
  const { isAndroid } = useDeviceStore();
  const { setBottomSheetVisible } = useChatStore();
  const styles = createStyles(colors);
  const { isKeyboardVisible } = useKeyboard();
  const messageActionsRef = useRef<BottomSheetRef>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const { currentDate, chipAnimation, handleScroll } = useDateChip(messages);

  useEffect(() => {
    setMessages(MOCK_CHAT_MESSAGES);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const handleSend = useCallback(() => {
    if (text.trim()) {
      onSend([
        {
          _id: Math.random(),
          text: text.trim(),
          createdAt: new Date(),
          user: { _id: 1 },
        },
      ]);
      setText("");
    }
  }, [text]);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    messageActionsRef.current?.snapToIndex(0);
    setBottomSheetVisible(true);
  };

  const messageActions = useMemo<BottomSheetAction[]>(
    () => [
      {
        text: "Copy",
        IconComponent: ClipboardTextIcon,
        onPress: () => {},
      },
      {
        text: "Edit",
        IconComponent: EditPencilIcon,
        onPress: () => {},
      },
      {
        text: "Delete",
        IconComponent: TrashIcon,
        onPress: () => {},
        iconColor: colors.error,
      },
    ],
    [colors.error]
  );

  return (
    <Layout style={{ flex: 1 }}>
      <ChatBackground />
      <Header title="Chat" />
      <View style={styles.globalBox}>
        <View
          style={[
            {
              flex: 1,
              marginBottom: isAndroid ? -55 : isKeyboardVisible ? -28 : -55,
            },
          ]}
        >
          <DateChip date={currentDate} animation={chipAnimation} />
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            renderAvatar={null}
            timeFormat="HH:mm"
            dateFormat="DD.MM.YY"
            locale="ru"
            onLongPress={handleLongPress}
            renderBubble={(props) => <Message {...props} />}
            renderInputToolbar={(props) => (
              <MessageInput
                {...props}
                text={text}
                onChangeText={setText}
                onSend={handleSend}
              />
            )}
            minInputToolbarHeight={62}
            listViewProps={{
              onScroll: handleScroll,
              scrollEventThrottle: 16,
              keyboardShouldPersistTaps: "never",
              contentContainerStyle: {
                paddingBottom: 50,
                paddingTop: 40,
                paddingHorizontal: 5,
              },
            }}
          />
        </View>
      </View>
      <Portal>
        <BottomSheetActions ref={messageActionsRef} items={messageActions} />
      </Portal>
    </Layout>
  );
};

export default ChatScreen;
