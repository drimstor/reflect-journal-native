import { useCallback } from "react";
import { useTimingAnimation } from "@/src/shared/lib/hooks";
import { Animated } from "react-native";

interface UseAnimationResult {
  animate: (toValue: number) => void;
  animation: Animated.Value;
  scaleInterpolation: Animated.AnimatedInterpolation<string | number>;
  handlePressIn: () => void;
  handlePressOut: () => void;
  animatedStyle: {
    transform: {
      scale: Animated.AnimatedInterpolation<string | number>;
    }[];
  };
}

export const useAnimation = (
  isAnimated: boolean = false
): UseAnimationResult => {
  const { animate, animation } = useTimingAnimation(undefined, {
    useNativeDriver: true,
    duration: 150,
  });

  const scaleInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const handlePressIn = useCallback(() => {
    if (isAnimated) animate(1);
  }, [isAnimated]);

  const handlePressOut = useCallback(() => {
    if (isAnimated) animate(0);
  }, [isAnimated]);

  const animatedStyle = {
    transform: [{ scale: scaleInterpolation }],
  };

  return {
    animate,
    animation,
    scaleInterpolation,
    handlePressIn,
    handlePressOut,
    animatedStyle,
  };
};
