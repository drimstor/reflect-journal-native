import { useRef } from "react";
import { Animated } from "react-native";

export const useAnimate = (initialValue: number = 0) => {
  const animation = useRef(new Animated.Value(initialValue)).current;

  const animate = (value: number) => {
    animation.setValue(value);
  };

  return { animation, animate };
};
