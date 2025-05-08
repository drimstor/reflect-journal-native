import React, { FC, useEffect } from "react";
import { Animated, Keyboard } from "react-native";
import { useBottomSheetStore } from "@/src/shared/store";
import { Portal } from "@gorhom/portal";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import RenderBubble from "./ui/RenderBubble";
import { ANIMATION_DELAY } from "./const/static";
import { ExtendedBubbleProps } from "./model/types";
import { useMessageAnimation } from "./lib/hooks/useMessageAnimation";
import { useMessageMeasure } from "./lib/hooks/useMessageMeasure";

const Message: FC<ExtendedBubbleProps> = (props) => {
  const { isBottomSheetVisible, setBottomSheetVisible } = useBottomSheetStore();

  const { animatedStyle, scaleAnimation, translateAnimation } =
    useMessageAnimation();

  const {
    bubbleLayout,
    measureOffset,
    setBubblePosition,
    resetBubblePosition,
    ref,
  } = useMessageMeasure();

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
            <RenderBubble {...props} />
          </Animated.View>
        </Portal>
      )}
    </>
  );
};

export default Message;
