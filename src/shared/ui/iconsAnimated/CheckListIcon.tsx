import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";
import Animated, { AnimatedProps } from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedIconProps extends IconProps {
  animatedProps?: AnimatedProps<any>;
}

const CheckListIcon: FC<AnimatedIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  animatedProps,
}) => {
  if (!animatedProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 19.5H21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11 12.5H21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11 5.5H21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 5.5L4 6.5L7 3.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 12.5L4 13.5L7 10.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 19.5L4 20.5L7 17.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M11 19.5H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M11 12.5H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M11 5.5H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M3 5.5L4 6.5L7 3.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M3 12.5L4 13.5L7 10.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d="M3 19.5L4 20.5L7 17.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animatedProps={animatedProps}
      />
    </Svg>
  );
};

export default CheckListIcon;
