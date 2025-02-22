import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";
import Animated, { AnimatedProps } from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedIconProps extends IconProps {
  animatedProps?: AnimatedProps<any>;
}

const SortIcon: FC<AnimatedIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  animatedProps,
}) => {
  if (!animatedProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 7H21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M6 12H18"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M10 17H14"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M3 7H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M6 12H18"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M10 17H14"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        animatedProps={animatedProps}
      />
    </Svg>
  );
};

export default SortIcon;
