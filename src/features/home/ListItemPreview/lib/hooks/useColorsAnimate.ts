import { useColorsAnimateProps } from "../../model/types";
import { useSharedValue, withTiming } from "react-native-reanimated";

export const useColorsAnimate = ({
  backgroundColor,
  backgroundColorForAnimate,
  color,
  colorForAnimate,
}: useColorsAnimateProps) => {
  const animation = useSharedValue(0);

  const animate = (toValue: number) => {
    animation.value = withTiming(toValue, {
      duration: 200,
    });
  };

  return {
    animate,
    animation,
    backgroundColor,
    backgroundColorForAnimate,
    color,
    colorForAnimate,
  };
};
