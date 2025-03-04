import React, { FC, useState, useCallback, useEffect } from "react";
import { Animated, View } from "react-native";
import { createStyles } from "./ChatScreen.styles";
import { Layout, Loader, NoData } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  addSnackbar,
  useAppDispatch,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import { Message as MessageType } from "@/src/entities/chat/model/types";
import {
  DateChip,
  Message,
  MessageInput,
  ChatBackground,
} from "@/src/features";
import { useDateChip } from "./lib/hooks/useDateChip";
import { useKeyboard } from "@/src/shared/lib/hooks/useKeyboard";
import * as Haptics from "expo-haptics";
import {
  ClipboardTextIcon,
  DotsIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import { useBottomSheetStore } from "@/src/shared/store";
import { useRoute } from "@react-navigation/native";
import { useGetChatMessagesQuery } from "@/src/entities";
import { useLang, useT, useTimingAnimation } from "@/src/shared/lib/hooks";

const ChatScreen: FC = () => {
  const t = useT();
  const dispatch = useAppDispatch();
  const { locale } = useLang();
  const { colors } = useThemeStore();
  const { isAndroid, window } = useDeviceStore();
  const { setBottomSheetVisible, setActions } = useBottomSheetStore();
  const styles = createStyles(colors);
  const { isKeyboardVisible } = useKeyboard();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const { currentDate, chipAnimation, handleScroll } = useDateChip(messages);
  const { animation } = useTimingAnimation(isKeyboardVisible, {
    duration: 700,
  });
  const route = useRoute();
  const { item } = route.params as any;

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery({
    chat_id: item.id,
    limit: 20,
    page: 1,
  });

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [page, setPage] = useState(1);

  const transformMessages = useCallback(
    (messages: MessageType[]): IMessage[] => {
      return messages.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.user_id,
        },
      }));
    },
    []
  );

  useEffect(() => {
    if (messagesData?.data) {
      const transformedMessages = transformMessages(messagesData.data);
      setMessages(transformedMessages);
    }
  }, [messagesData]);

  const handleLoadEarlier = useCallback(async () => {
    if (isLoadingEarlier) return;

    setIsLoadingEarlier(true);
    try {
      const nextPage = page + 1;
      const result = await refetchMessages();

      if (result.data?.data && result.data.data.length > 0) {
        const transformedMessages = transformMessages(result.data.data);
        setMessages((prevMessages) => [
          ...transformedMessages,
          ...prevMessages,
        ]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading earlier messages:", error);
    } finally {
      setIsLoadingEarlier(false);
    }
  }, [page, isLoadingEarlier, refetchMessages, transformMessages]);

  const handleSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (text.trim()) {
        const messageToSend: IMessage = {
          _id: Math.random().toString(),
          text: text.trim(),
          createdAt: new Date(),
          user: { _id: "1" },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [messageToSend])
        );
        setText("");
      }
    },
    [text]
  );

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setActions([
      {
        text: t("shared.actions.copy"),
        IconComponent: ClipboardTextIcon,
        onPress: () => {
          dispatch(
            addSnackbar({
              text: t("shared.actions.copied"),
              type: "success",
            })
          );
        },
      },
      {
        text: t("shared.actions.edit"),
        IconComponent: EditPencilIcon,
        onPress: () => {},
      },
      {
        text: t("shared.actions.delete"),
        IconComponent: TrashIcon,
        onPress: () => {},
        iconColor: colors.error,
      },
    ]);

    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 0);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ChatBackground />
      <Header
        title={item.name}
        backButton
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} />,
          onPress: () => {},
        }}
      />
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
            onSend={handleSend}
            user={{ _id: "109a3ed8-9abb-4801-8436-a3a6436bbf14" }}
            renderAvatar={null}
            timeFormat="HH:mm"
            dateFormat="DD.MM.YY"
            locale={locale}
            onLongPress={handleLongPress}
            renderChatEmpty={() =>
              !isLoadingMessages &&
              !messagesData?.data.length && (
                <Animated.View
                  style={{
                    top: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [window.height / 2, window.height / 4],
                    }),
                    transform: [
                      { translateX: "-50%" },
                      { translateY: "-50%" },
                      { scaleY: -1 },
                    ],
                    position: "absolute",
                    left: window.width / 2,
                    right: window.width / 2,
                    backgroundColor: colors.secondary,
                    width: window.width - 90,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: colors.alternate,
                    paddingBottom: 10,
                    overflow: "hidden",
                  }}
                >
                  <NoData type="noMessage" />
                </Animated.View>
              )
            }
            renderChatFooter={() => (
              <Loader
                style={{
                  transform: [
                    { translateX: "-50%" },
                    { translateY: "-50%" },
                    { scaleY: -1 },
                  ],
                  position: "absolute",
                  top: window.height / 3.3,
                  left: window.width / 2,
                  right: window.width / 2,
                }}
                size={window.width - 150}
                isVisible={isLoadingMessages}
              />
            )}
            renderBubble={(props) => <Message {...props} />}
            renderInputToolbar={(props) => (
              <MessageInput
                {...props}
                text={text}
                onChangeText={setText}
                onSend={() => handleSend([])}
              />
            )}
            minInputToolbarHeight={62}
            loadEarlier={Boolean(
              messagesData?.currentPage &&
                messagesData?.totalPages &&
                messagesData.currentPage < messagesData.totalPages
            )}
            isLoadingEarlier={isLoadingEarlier}
            onLoadEarlier={handleLoadEarlier}
            infiniteScroll={true}
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
    </Layout>
  );
};

export default ChatScreen;
