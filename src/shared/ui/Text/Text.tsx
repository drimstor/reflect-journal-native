import { useThemeStore } from "@/src/shared/store";
import { FC, ReactNode } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from "react-native";
import { fontStyles, sizeStyles, textStyles } from "./Text.styles";

export interface TextProps {
  children: ReactNode;
  size?:
    | "small"
    | "medium"
    | "base"
    | "normal"
    | "large"
    | "title"
    | "extraLarge"
    | "header";
  font?: "regular" | "bold" | "thin";
  withOpacity?: number | string;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: RNTextProps["ellipsizeMode"];
}

const { contrastReverse } = useThemeStore.getState().colors;

const Text: FC<TextProps> = ({
  children,
  size = "base",
  font = "regular",
  color = contrastReverse,
  withOpacity,
  style,
  numberOfLines,
  ellipsizeMode,
}) => {
  return (
    <RNText
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        size && sizeStyles[size],
        color && { color: `${color}${withOpacity ?? ""}` },
        font && fontStyles[font],
        textStyles.text,
        style && style,
      ]}
    >
      {children}
    </RNText>
  );
};

export default Text;
