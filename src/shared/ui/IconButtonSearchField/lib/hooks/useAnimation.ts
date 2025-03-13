import { useTimingAnimation } from "@/src/shared/lib/hooks";
import { Animated } from "react-native";
import { useDeviceStore } from "@/src/shared/store";

interface UseAnimationResult {
  animation: Animated.Value;
  animatedStyle: {
    width: Animated.AnimatedInterpolation<string | number>;
  };
}

export const useAnimation = (state: boolean): UseAnimationResult => {
  const { window } = useDeviceStore();

  const { animation } = useTimingAnimation(state, {
    duration: 250,
  });

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [55, window.width - 24 * 2],
  });

  const marginRight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const animatedStyle = {
    width,
    marginRight,
  };

  return {
    animation,
    animatedStyle,
  };
};
