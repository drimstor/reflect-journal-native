import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    tooltipContainer: {
      backgroundColor: themeColors.secondary,
      borderRadius: 10,
      paddingTop: 5,
      paddingBottom: 7,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: themeColors.alternate,
      shadowColor: themeColors.alternate,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxWidth: 250,
    },
  });
};
