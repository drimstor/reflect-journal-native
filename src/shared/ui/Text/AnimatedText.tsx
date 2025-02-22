import { FC } from "react";
import { Animated } from "react-native";
import { sizeStyles, fontStyles, textStyles } from "./Text.styles";
import { useThemeStore } from "@/src/shared/store";
import { Text } from "react-native";
import { TextProps } from "./Text";

interface AnimatedTextProps extends TextProps {
  animatedStyle?: {
    color: Animated.AnimatedInterpolation<string | number>;
  };
}

const AnimatedTextBase = Animated.createAnimatedComponent(Text);

const { contrastReverse } = useThemeStore.getState().colors;

const AnimatedText: FC<AnimatedTextProps> = ({
  children,
  size = "base",
  font = "regular",
  color = contrastReverse,
  withOpacity,
  style,
  animatedStyle,
}) => {
  return (
    <AnimatedTextBase
      style={[
        size && sizeStyles[size],
        color && { color: `${color}${withOpacity ?? ""}` },
        font && fontStyles[font],
        textStyles.text,
        style && style,
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedTextBase>
  );
};

export default AnimatedText;
