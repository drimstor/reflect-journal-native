import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { PALLETE_COLORS, PATHS } from "../const";

export type Theme = keyof typeof PALLETE_COLORS;
export type ThemeColors = (typeof PALLETE_COLORS)[Theme];
export type PaletteColor =
  (typeof PALLETE_COLORS)[keyof typeof PALLETE_COLORS][keyof typeof PALLETE_COLORS.dark];

export type NavigationProps = BottomTabNavigationProp<any, typeof PATHS.HOME>;

export interface IconProps {
  color?: string;
  secondColor?: string;
  size?: number;
  opacity?: number;
  variant?: "outlined" | "filled";
}
