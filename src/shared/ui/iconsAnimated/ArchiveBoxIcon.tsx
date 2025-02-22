import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { Animated } from "react-native";
import { AnimatedStrokeIconProps } from "./types";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ArchiveBoxIcon: FC<AnimatedStrokeIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  animatedStyle,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M19.5 10.22V19C19.5 21 19 22 16.5 22H7.5C5 22 4.5 21 4.5 19V10.22"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
      <AnimatedPath
        d="M5 2H19C21 2 22 3 22 5V7C22 9 21 10 19 10H5C3 10 2 9 2 7V5C2 3 3 2 5 2Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
      <AnimatedPath
        d="M10.18 14H13.82"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={animatedStyle.stroke || color}
      />
    </Svg>
  );
};

export default ArchiveBoxIcon;
