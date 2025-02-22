import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";
import { ScaledSize } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

export const createStyles = (
  colors: ThemeColors,
  window: ScaledSize,
  insets: EdgeInsets,
  statusBarHeight: number
) =>
  StyleSheet.create({
    background: {
      height: window.height + 20,
      top: -(insets.top + statusBarHeight),
      backgroundColor: colors.background,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
