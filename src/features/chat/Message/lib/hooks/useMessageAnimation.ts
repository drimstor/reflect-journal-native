import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ANIMATION_DELAY } from "../../const/static";

export const useMessageAnimation = () => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const startPressAnimation = () => {
    scale.value = withTiming(0.95, { duration: ANIMATION_DELAY });
  };

  const resetAnimation = () => {
    scale.value = withSpring(1);
  };

  const translateMessage = (offset: number) => {
    translateY.value = withTiming(offset, { duration: ANIMATION_DELAY });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  return {
    animatedStyle,
    startPressAnimation,
    resetAnimation,
    translateMessage,
  };
};
