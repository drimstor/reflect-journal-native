import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    touchableOpacity: {
      width: 55,
      height: 55,
      backgroundColor: theme.contrastReverse,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 27.5, // Половина от width/height (55/2)
      borderWidth: 1,
      borderColor: theme.alternate,
    },
    activeIndicator: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accent,
    },
  });
};
