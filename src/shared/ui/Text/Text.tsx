import { FC, ReactNode } from "react";
import { StyleProp, TextStyle, TextProps as RNTextProps } from "react-native";
import { sizeStyles, fontStyles, textStyles } from "./Text.styles";
import { useThemeStore } from "@/src/shared/store";
import { Text as RNText } from "react-native";

export interface TextProps {
  children: ReactNode;
  size?:
    | "small"
    | "medium"
    | "base"
    | "large"
    | "title"
    | "extraLarge"
    | "header";
  font?: "regular" | "bold" | "thin";
  withOpacity?: number;
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
