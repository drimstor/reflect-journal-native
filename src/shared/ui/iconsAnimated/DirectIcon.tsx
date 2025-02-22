import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { Animated } from "react-native";
import { AnimatedStrokeIconProps } from "./types";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DirectIcon: FC<AnimatedStrokeIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  animatedStyle,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
      <AnimatedPath
        d="M2 13H5.76C6.52 13 7.21 13.43 7.55 14.11L8.44 15.9C9 17 10 17 10.24 17H13.77C14.53 17 15.22 16.57 15.56 15.89L16.45 14.1C16.79 13.42 17.48 12.99 18.24 12.99H21.98"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
      <AnimatedPath
        d="M10.34 7H13.67"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
      <AnimatedPath
        d="M9.5 10H14.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
    </Svg>
  );
};

export default DirectIcon;
