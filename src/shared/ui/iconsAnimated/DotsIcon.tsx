import { FC } from "react";
import Svg, { Rect } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";
import { Animated } from "react-native";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface AnimatedIconProps extends IconProps {
  animatedProps?: {
    fill?: any;
  };
}

const DotsIcon: FC<AnimatedIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  animatedProps,
}) => {
  if (!animatedProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect width="4" height="4" x="3" y="10" rx="2" fill={color} />
        <Rect width="4" height="4" x="10" y="10" rx="2" fill={color} />
        <Rect width="4" height="4" x="17" y="10" rx="2" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedRect
        width="4"
        height="4"
        x="3"
        y="10"
        rx="2"
        fill={animatedProps.fill || color}
      />
      <AnimatedRect
        width="4"
        height="4"
        x="10"
        y="10"
        rx="2"
        fill={animatedProps.fill || color}
      />
      <AnimatedRect
        width="4"
        height="4"
        x="17"
        y="10"
        rx="2"
        fill={animatedProps.fill || color}
      />
    </Svg>
  );
};

export default DotsIcon;
