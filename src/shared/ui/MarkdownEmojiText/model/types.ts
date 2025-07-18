import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export interface MarkdownEmojiTextProps {
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
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

export interface ParsedElement {
  type: "text" | "bold" | "header" | "emoji";
  content: string;
  level?: number; // Уровень заголовка (1-6)
}
