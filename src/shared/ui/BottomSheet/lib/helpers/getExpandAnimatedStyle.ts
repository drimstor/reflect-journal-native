import { Animated } from "react-native";

export const getExpandAnimatedStyle = (
  expandAnimation: Animated.AnimatedInterpolation<string | number>
) => ({
  transform: [
    {
      translateY: expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-16, 0],
      }),
    },
  ],
});
