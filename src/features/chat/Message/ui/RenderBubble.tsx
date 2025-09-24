import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useThemeStore } from "@/src/shared/store";
import { FullScreenPreview, MarkdownEmojiText } from "@/src/shared/ui";
import { CommandWidgetChat } from "@/src/widgets";
import { View } from "react-native";
import { Bubble, BubbleProps, IMessage, Time } from "react-native-gifted-chat";
import MessageLoaderBox from "../../MessageLoaderBox/MessageLoaderBox";
import { createStyles } from "./RenderBubble.styles";

interface ExtendedIMessage extends IMessage {
  images?: string[];
  command?: string;
}

const RenderBubble = (
  props: BubbleProps<ExtendedIMessage> & { disableImageLoaders?: boolean }
) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);

  const isNoMessage = !props.currentMessage?.text?.trim();

  // Кастомный рендер для текста сообщения с поддержкой эмодзи
  const renderCustomView = () => {
    // Показываем лоадер, если сообщение пустое (временное/загружаемое)
    if (props.currentMessage._id.toString().startsWith("temp-")) {
      return <MessageLoaderBox style={{ marginBottom: -16 }} />;
    }

    // Показываем текст сообщения с поддержкой эмодзи
    return (
      <View style={{ padding: 8 }}>
        {/* Отображение изображений, если есть */}
        {props.currentMessage.images &&
          props.currentMessage.images.length > 0 && (
            <FullScreenPreview
              images={props.currentMessage.images}
              maxVisible={4}
              imageSize={120}
              spacing={6}
              columns={2}
              disableImageLoaders={props.disableImageLoaders}
              containerStyle={{
                marginBottom: props.currentMessage.text ? 8 : 0,
              }}
            />
          )}
        {/* Отображение текста сообщения */}
        {!isNoMessage && (
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
        )}
        {/* Отображение команды, если есть */}
        {props.currentMessage.command && (
          <CommandWidgetChat
            sourceType={ENTITY_NAME.MESSAGES}
            currentItem={{
              id: props.currentMessage._id,
              command: props.currentMessage.command,
            }}
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
