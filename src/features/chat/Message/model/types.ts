import { BubbleProps, IMessage } from "react-native-gifted-chat";

export interface ExtendedBubbleProps extends BubbleProps<IMessage> {
  timeTextStyle?: {
    left?: { color: string };
    right?: { color: string };
  };
  disableImageLoaders?: boolean;
}
