import { useRef } from "react";
import { Animated, PanResponder } from "react-native";
import { useTimingAnimation, useToggle } from "../../../../lib/hooks";

interface UseSnackbarAnimationProps {
  onClose: () => void;
}

export const useSnackbarAnimation = ({
  onClose,
}: UseSnackbarAnimationProps) => {
  const { value: isVisible, toggle: toggleVisible } = useToggle(true);
  const { animation } = useTimingAnimation(isVisible, { duration: 400 });
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          toggleVisible();
          setTimeout(onClose, 400);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        translateY: Animated.add(
          panY,
          animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          })
        ),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  return {
    panHandlers: panResponder.panHandlers,
    animatedStyle,
    toggleVisible,
  };
};
