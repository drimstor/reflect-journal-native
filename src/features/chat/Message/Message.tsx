import { useBottomSheetStore } from "@/src/shared/store";
import { Portal } from "@gorhom/portal";
import { FC, useEffect } from "react";
import { Keyboard } from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ANIMATION_DELAY } from "./const/static";
import { useMessageAnimation } from "./lib/hooks/useMessageAnimation";
import { useMessageMeasure } from "./lib/hooks/useMessageMeasure";
import { ExtendedBubbleProps } from "./model/types";
import RenderBubble from "./ui/RenderBubble";

const Message: FC<ExtendedBubbleProps> = (props) => {
  const { isBottomSheetVisible, setBottomSheetVisible } = useBottomSheetStore();

  const { translateY, scale, scaleAnimation, translateAnimation } =
    useMessageAnimation();

  const {
    bubbleLayout,
    measureOffset,
    setBubblePosition,
    resetBubblePosition,
    ref,
  } = useMessageMeasure();

  // Создаем анимированный стиль с использованием Reanimated
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  useEffect(() => {
    if (!isBottomSheetVisible) {
      translateAnimation(0);
      setTimeout(resetBubblePosition, ANIMATION_DELAY);
    }
  }, [isBottomSheetVisible]);

  const flowData = {
    variant: "Messages",
    id: props.currentMessage._id,
    user_id: props.currentMessage.user._id,
    text: props.currentMessage.text,
    // images: props.currentMessage.images,
    // command: props.currentMessage.command,
  };

  const handleStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
    if (!Keyboard.isVisible()) {
      const { isNeedTranslate, offset } = measureOffset();

      if (nativeEvent.state === State.BEGAN) {
        setBubblePosition();
        if (!isNeedTranslate) scaleAnimation(0.94);
      } else if (nativeEvent.state === State.ACTIVE) {
        if (isNeedTranslate) translateAnimation(offset);
        props.onLongPress?.(flowData);
      } else {
        if (!isNeedTranslate) scaleAnimation(1);
        if (!isBottomSheetVisible) resetBubblePosition();
      }
    }
  };

  return (
    <>
      <LongPressGestureHandler
        onHandlerStateChange={handleStateChange}
        minDurationMs={ANIMATION_DELAY}
      >
        <Animated.View ref={ref} style={animatedStyle}>
          <RenderBubble {...props} />
        </Animated.View>
      </LongPressGestureHandler>

      {bubbleLayout.x !== 0 && bubbleLayout.y !== 0 && (
        <Portal>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: bubbleLayout.x,
                top: bubbleLayout.y,
                width: bubbleLayout.width,
                height: bubbleLayout.height,
              },
              animatedStyle,
            ]}
            onTouchEnd={() => setBottomSheetVisible(false)}
          >
            <RenderBubble {...props} disableImageLoaders={true} />
          </Animated.View>
        </Portal>
      )}
    </>
  );
};

export default Message;
