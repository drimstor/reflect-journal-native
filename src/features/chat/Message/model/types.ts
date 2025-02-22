import { IMessage } from "react-native-gifted-chat";
import { BubbleProps } from "react-native-gifted-chat";

export interface ExtendedBubbleProps extends BubbleProps<IMessage> {
  timeTextStyle?: {
    left?: { color: string };
    right?: { color: string };
  };
}
