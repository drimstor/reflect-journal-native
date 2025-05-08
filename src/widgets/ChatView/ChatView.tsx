import React, { FC } from "react";
import { Animated, View } from "react-native";
import { Loader, NoData } from "@/src/shared/ui";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { DateChip, Message, MessageInput } from "@/src/features";
import { useLang } from "@/src/shared/lib/hooks";
import MessageLoaderBox from "@/src/features/chat/MessageLoaderBox/MessageLoaderBox";
import { useChatAnimation } from "./lib/hooks/useChatAnimation";
import { MessageGiftedChat } from "@/src/entities/chat/model/types";

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
  handleSend: (
    setMessages: React.Dispatch<React.SetStateAction<MessageGiftedChat[]>>
  ) => void;
  handleLongPress: (flowData: any) => void;
  currentDate: Date;
  chipAnimation: Animated.Value;
  handleScroll: (event: any) => void;
  userId: string;
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
  handleLongPress,
  currentDate,
  chipAnimation,
  handleScroll,
  userId,
}) => {
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const { locale } = useLang();
  const { containerStyle, getEmptyViewStyle, getLoaderStyle } =
    useChatAnimation();

  return (
    <View style={containerStyle}>
      <DateChip date={currentDate} animation={chipAnimation} />
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => handleSend(setMessages)}
        user={{ _id: userId || "" }}
        renderAvatar={null}
        timeFormat="HH:mm"
        dateFormat="DD.MM.YY"
        locale={locale}
        onLongPress={handleLongPress}
        renderCustomView={(props) => {
          if (
            typeof props.currentMessage?._id === "string" &&
            props.currentMessage._id.startsWith("temp-")
          ) {
            return <MessageLoaderBox />;
          }
          return null;
        }}
        renderChatEmpty={() =>
          !isLoadingMessages &&
          !messagesData?.data?.length && (
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
            onSend={() => handleSend(setMessages)}
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
  );
};

export default ChatView;
