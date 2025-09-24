import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { DateChip, Message, MessageInput } from "@/src/features";
import { useLang } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { Loader, NoData, ScrollToBottomButton } from "@/src/shared/ui";
import React, { FC } from "react";
import { Animated, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useChatAnimation } from "./lib/hooks/useChatAnimation";

const ChatView: FC<{
  item: any;
  messages: MessageGiftedChat[];
  setMessages: React.Dispatch<React.SetStateAction<MessageGiftedChat[]>>;
  messagesData: any;
  isLoadingMessages: boolean;
  isLoadingEarlier: boolean;
  handleLoadEarlier: () => Promise<void>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  onQuickReply: (flowData: any) => void;
  currentDate: Date;
  chipAnimation: Animated.Value;
  handleScroll: (event: any) => void;
  userId: string;
  isCanBeEmpty: boolean;
  scrollToBottom: () => void;
  messageContainerRef: any;
}> = ({
  messages,
  setMessages,
  messagesData,
  isLoadingMessages,
  isLoadingEarlier,
  handleLoadEarlier,
  text,
  setText,
  handleSend,
  onQuickReply,
  currentDate,
  chipAnimation,
  handleScroll,
  userId,
  isCanBeEmpty,
  scrollToBottom,
  messageContainerRef,
}) => {
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const { locale } = useLang();
  const { containerStyle, getEmptyViewStyle, getLoaderStyle } =
    useChatAnimation();

  return (
    <View style={containerStyle}>
      <DateChip date={currentDate} animation={chipAnimation} />
      <ScrollToBottomButton
        onPress={scrollToBottom}
        animation={chipAnimation}
      />
      <GiftedChat
        messageContainerRef={messageContainerRef}
        messages={messages as unknown as IMessage[]}
        onSend={handleSend}
        user={{ _id: userId || "" }}
        renderAvatar={null}
        timeFormat="HH:mm"
        dateFormat="DD.MM.YY"
        locale={locale}
        onQuickReply={onQuickReply}
        renderChatEmpty={() =>
          !isLoadingMessages &&
          !messagesData?.data?.length &&
          isCanBeEmpty && (
            <Animated.View
              style={
                {
                  ...getEmptyViewStyle(),
                  backgroundColor: colors.secondary,
                  borderColor: colors.alternate,
                } as any
              }
            >
              <NoData type="noMessage" />
            </Animated.View>
          )
        }
        renderChatFooter={() => (
          <Loader
            style={getLoaderStyle() as any}
            size={window.width - 100}
            isVisible={isLoadingMessages}
          />
        )}
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
        loadEarlier={Boolean(
          messagesData?.currentPage &&
            messagesData?.totalPages &&
            messagesData.currentPage < messagesData.totalPages
        )}
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={handleLoadEarlier}
        infiniteScroll
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
  );
};

export default ChatView;
