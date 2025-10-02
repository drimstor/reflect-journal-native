import { Theme } from "@/src/shared/model/types";
import { ScaledSize, StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

export const createStyles = (
  theme: Theme,
  window: ScaledSize,
  insets: EdgeInsets,
  statusBarHeight: number
) =>
  StyleSheet.create({
    background: {
      height: window.height + 20,
      top: -(insets.top + statusBarHeight),
      backgroundColor: theme === "light" ? "#F1F2F3" : "#181822",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
