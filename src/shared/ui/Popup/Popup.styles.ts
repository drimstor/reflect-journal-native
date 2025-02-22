import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "transparent",
    },
    popup: {
      position: "absolute",
      width: 151,
      padding: 10,
      backgroundColor: themeColors.accentGrey,
      borderRadius: 12,
      gap: 12,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
  });
};
