import { PaletteColor } from "@/src/shared/model/types";
import { ReactNode } from "react";

export interface TextFieldProps {
  value: string;
  label?: string;
  editable?: boolean;
  multiline?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
  stateType?: null | "success" | "error";
  helperText?: string;
  phone?: boolean;
  width?: number | string;
  keyboardType?: "numeric" | "default";
  backgroundColor: PaletteColor;
  startIcon?: ReactNode;
  size?: "small" | "medium";
  secureTextEntry?: boolean;
  labelColor?: PaletteColor;
  placeholderColor?: PaletteColor;
  textColor?: PaletteColor;
  helperTextColor?: PaletteColor;
}
