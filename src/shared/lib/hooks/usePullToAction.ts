import { useState, useCallback, useMemo } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useAnimate } from "./animation/useAnimate";

interface UsePullToActionProps {
  onAction: () => void;
  threshold?: number;
  pullDistance?: number;
}

export const usePullToAction = ({
  onAction,
  threshold = 0.3,
  pullDistance = 20,
}: UsePullToActionProps) => {
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [shouldTriggerAction, setShouldTriggerAction] = useState(false);
  const { animation: pullAnimation, animate: animatePull } = useAnimate();

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (offsetY < -pullDistance) {
        const progress = Math.min(
          Math.abs(offsetY + pullDistance) / pullDistance,
          1
        );

        if (progress < threshold) {
          animatePull(0);
        } else {
          animatePull(progress);
        }

        if (progress === 1) {
          setIsPullingDown(true);
          setShouldTriggerAction(true);
        }
      } else {
        animatePull(0);
        setIsPullingDown(false);

        if (offsetY > -5 && shouldTriggerAction) {
          onAction();
          setShouldTriggerAction(false);
        }
      }
    },
    [pullDistance, threshold, shouldTriggerAction]
  );

  const handleScrollEnd = useCallback(() => {
    if (!isPullingDown) {
      setShouldTriggerAction(false);
    }
  }, [isPullingDown]);

  const visibleAnimation = useMemo(() => {
    return {
      opacity: pullAnimation,
      transform: [
        {
          scale: pullAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          }),
        },
        {
          translateY: pullAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
      ],
    };
  }, [pullAnimation]);

  return {
    handleScroll,
    handleScrollEnd,
    visibleAnimation,
  };
};
