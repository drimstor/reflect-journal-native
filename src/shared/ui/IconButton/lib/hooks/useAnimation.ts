import { useCallback } from "react";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

interface UseAnimationResult {
  animate: (toValue: number) => void;
  animation: any;
  handlePressIn: () => void;
  handlePressOut: () => void;
  animatedStyle: object;
}

export const useAnimation = (
  isAnimated: boolean = false
): UseAnimationResult => {
  const animation = useSharedValue(0);

  const animate = useCallback((toValue: number) => {
    animation.value = withTiming(toValue, {
      duration: 150,
    });
  }, []);

  const handlePressIn = useCallback(() => {
    if (isAnimated) animate(1);
  }, [isAnimated, animate]);

  const handlePressOut = useCallback(() => {
    if (isAnimated) animate(0);
  }, [isAnimated, animate]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value, [0, 1], [1, 0.9]);

    return {
      transform: [{ scale }],
    };
  });

  return {
    animate,
    animation,
    handlePressIn,
    handlePressOut,
    animatedStyle,
  };
};
