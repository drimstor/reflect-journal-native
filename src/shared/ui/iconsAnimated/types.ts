import { IconProps } from "@/src/shared/model/types";
import { Animated } from "react-native";

export interface AnimatedFillIconProps extends IconProps {
  animatedStyle: {
    fill?: Animated.AnimatedInterpolation<string | number>;
  };
}

export interface AnimatedStrokeIconProps extends IconProps {
  animatedStyle: {
    stroke?: Animated.AnimatedInterpolation<string | number>;
  };
}

export interface AnimatedIconProps extends IconProps {
  animatedStyle: {
    fill?: Animated.AnimatedInterpolation<string | number>;
    stroke?: Animated.AnimatedInterpolation<string | number>;
  };
}
