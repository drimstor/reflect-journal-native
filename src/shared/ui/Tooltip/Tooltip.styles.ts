import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    tooltipContainer: {
      backgroundColor: themeColors.light,
      borderRadius: 10,
      paddingTop: 5,
      paddingBottom: 7,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: themeColors.alternate,
      maxWidth: 250,
      alignSelf: "flex-start",
      flexShrink: 1,
    },
  });
};
