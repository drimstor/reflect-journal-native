import React, { FC, useEffect } from "react";
import { useChatStore } from "@/src/shared/store";
import { Portal } from "@gorhom/portal";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import Reanimated, { runOnJS } from "react-native-reanimated";
import RenderBubble from "./ui/RenderBubble";
import { ANIMATION_DELAY } from "./const/static";
import { ExtendedBubbleProps } from "./model/types";
import { useMessageAnimation } from "./lib/hooks/useMessageAnimation";
import { useMessageMeasure } from "./lib/hooks/useMessageMeasure";

const Message: FC<ExtendedBubbleProps> = (props) => {
  const { isBottomSheetVisible, setBottomSheetVisible } = useChatStore();

  const {
    animatedStyle,
    startPressAnimation,
    resetAnimation,
    translateMessage,
  } = useMessageAnimation();

  const {
    bubbleLayout,
    measureOffset,
    setBubblePosition,
    resetBubblePosition,
    ref,
  } = useMessageMeasure();

  useEffect(() => {
    if (!isBottomSheetVisible) {
      resetAnimation();
      translateMessage(0);
      setTimeout(resetBubblePosition, ANIMATION_DELAY);
    }
  }, [isBottomSheetVisible]);

  const handleStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
    const { isNeedTranslate, offset } = measureOffset();

    if (nativeEvent.state === State.BEGAN) {
      setBubblePosition();
      startPressAnimation();
    } else if (nativeEvent.state === State.ACTIVE) {
      resetAnimation();
      if (isNeedTranslate) translateMessage(offset);
      if (props.onLongPress) runOnJS(props.onLongPress)();
    } else {
      resetAnimation();
      if (!isBottomSheetVisible) resetBubblePosition();
    }
  };

  return (
    <>
      <LongPressGestureHandler
        onHandlerStateChange={handleStateChange}
        minDurationMs={ANIMATION_DELAY}
      >
        <Reanimated.View ref={ref} style={animatedStyle}>
          <RenderBubble {...props} />
        </Reanimated.View>
      </LongPressGestureHandler>

      {bubbleLayout.x !== 0 && bubbleLayout.y !== 0 && (
        <Portal>
          <Reanimated.View
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
          </Reanimated.View>
        </Portal>
      )}
    </>
  );
};

export default Message;
