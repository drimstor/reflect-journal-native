import { Bubble, Time, BubbleProps } from "react-native-gifted-chat";
import { IMessage } from "react-native-gifted-chat";
import { useThemeStore } from "@/src/shared/store";
import { createStyles } from "./RenderBubble.styles";

const RenderBubble = (props: BubbleProps<IMessage>) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);

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
