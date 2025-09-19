import { FC } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSwipeGesture } from "./lib/hooks/useSwipeGesture";
import { ExtendedBubbleProps } from "./model/types";
import RenderBubble from "./ui/RenderBubble";

const Message: FC<ExtendedBubbleProps> = (props) => {
  const flowData = {
    variant: "Messages",
    id: props.currentMessage._id,
    user_id: props.currentMessage.user._id,
    text: props.currentMessage.text,
  };

  const handleSwipeComplete = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        props.onQuickReply?.(flowData as any);
      });
    }, 200);
  };

  const { panGesture, translateX } = useSwipeGesture({
    onSwipeStart: () => {},
    onSwipeComplete: handleSwipeComplete,
    onSwipeEnd: () => {},
  });

  // Создаем анимированный стиль только для горизонтального движения
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <RenderBubble {...props} />
      </Animated.View>
    </GestureDetector>
  );
};

export default Message;
