import { useSharedValue, withTiming } from "react-native-reanimated";

export const useMessageAnimation = () => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const scaleAnimation = (value: number) => {
    scale.value = withTiming(value, {
      duration: 400,
    });
  };

  const translateAnimation = (offset: number) => {
    translateY.value = withTiming(offset, {
      duration: 300,
    });
  };

  return {
    translateY,
    scale,
    translateAnimation,
    scaleAnimation,
  };
};
