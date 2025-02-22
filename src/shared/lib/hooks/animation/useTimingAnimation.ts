import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseTimingAnimationProps {
  useNativeDriver?: boolean;
  duration?: number;
  easing?: (value: number) => number;
  initialValue?: number;
}

export const useTimingAnimation = (
  isVisible?: boolean,
  {
    useNativeDriver = false,
    duration = 200,
    easing,
    initialValue = 0,
  }: UseTimingAnimationProps = {}
) => {
  const animation = useRef(new Animated.Value(initialValue)).current;

  const animate = (toValue: number) => {
    Animated.timing(animation, {
      toValue,
      useNativeDriver,
      duration,
      easing,
    }).start();
  };

  if (isVisible === undefined) return { animation, animate };

  useEffect(() => {
    animate(isVisible ? 1 : 0);
  }, [isVisible]);

  return { animation, animate };
};
