import { FC } from "react";
import Animated from "react-native-reanimated";
import { sizeStyles, fontStyles, textStyles } from "./Text.styles";
import { useThemeStore } from "@/src/shared/store";
import { TextProps } from "./Text";

interface AnimatedTextProps extends TextProps {
  animatedStyle?: {
    color: any;
  };
}

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
    <Animated.Text
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
    </Animated.Text>
  );
};

export default AnimatedText;
