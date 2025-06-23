import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useThemeStore } from "@/src/shared/store";
import { MarkdownEmojiText } from "@/src/shared/ui";
import { CommandWidgetChat } from "@/src/widgets";
import { View } from "react-native";
import { Bubble, BubbleProps, IMessage, Time } from "react-native-gifted-chat";
import MessageLoaderBox from "../../MessageLoaderBox/MessageLoaderBox";
import { createStyles } from "./RenderBubble.styles";

const RenderBubble = (props: BubbleProps<IMessage>) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);

  // Кастомный рендер для текста сообщения с поддержкой эмодзи
  const renderCustomView = () => {
    // Показываем лоадер, если сообщение пустое (временное/загружаемое)
    if (
      !props.currentMessage?.text ||
      props.currentMessage.text.trim() === ""
    ) {
      return <MessageLoaderBox />;
    }

    // Показываем текст сообщения с поддержкой эмодзи
    return (
      <View style={{ padding: 8 }}>
        <MarkdownEmojiText
          color={
            props.position === "right"
              ? styles.textRight.color
              : styles.textLeft.color
          }
          style={{
            fontFamily:
              props.position === "right"
                ? styles.textRight.fontFamily
                : styles.textLeft.fontFamily,
            fontSize: 16,
          }}
        >
          {props.currentMessage.text}
        </MarkdownEmojiText>
        {props.currentMessage.command && (
          <CommandWidgetChat
            currentItem={{
              id: props.currentMessage._id,
              command: props.currentMessage.command,
            }}
            sourceType={ENTITY_NAME.MESSAGES}
          />
        )}
      </View>
    );
  };

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.wrapperRight,
        left: styles.wrapperLeft,
      }}
      textStyle={{
        right: styles.textRight,
        left: styles.textLeft,
      }}
      renderCustomView={renderCustomView}
      renderMessageText={() => null}
      renderTime={(timeProps) => (
        <Time
          {...timeProps}
          timeTextStyle={{
            right: styles.timeRight,
            left: styles.timeLeft,
          }}
        />
      )}
    />
  );
};

export default RenderBubble;
