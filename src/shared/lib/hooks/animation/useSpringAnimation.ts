import { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface UseSpringAnimationProps {
  useNativeDriver?: boolean;
  tension?: number;
  friction?: number;
  initialValue?: number;
}

export const useSpringAnimation = (
  isVisible?: boolean,
  {
    useNativeDriver = true,
    tension = 100,
    friction = 10,
    initialValue = 0,
  }: UseSpringAnimationProps = {}
) => {
  const animation = useRef(new Animated.Value(initialValue)).current;

  const animate = (toValue: number) => {
    Animated.spring(animation, {
      toValue,
      useNativeDriver,
      tension,
      friction,
    }).start();
  };

  if (isVisible === undefined) return { animation, animate };

  useEffect(() => {
    animate(isVisible ? 1 : 0);
  }, [isVisible]);

  return { animation, animate };
};
