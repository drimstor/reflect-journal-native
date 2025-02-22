import { useColorsAnimateProps } from "../../model/types";
import { useTimingAnimation } from "@/src/shared/lib/hooks";

export const useColorsAnimate = ({
  backgroundColor,
  backgroundColorForAnimate,
  color,
  colorForAnimate,
}: useColorsAnimateProps) => {
  const { animate, animation } = useTimingAnimation();

  const animatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [color, colorForAnimate],
  });

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, backgroundColorForAnimate],
  });

  return {
    animate,
    animatedColor,
    animatedBackgroundColor,
  };
};
