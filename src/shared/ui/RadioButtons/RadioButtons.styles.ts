import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    wrapper: {
      flexDirection: "column",
      width: "100%",
    },
    optionWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
    },
    contained: {
      paddingHorizontal: 16,
      height: 52,
      borderRadius: 16,
      backgroundColor: themeColors.accentGrey,
    },
    optionDescription: {
      flexDirection: "column",
      gap: 6,
      width: "90%",
    },
    optionUnchecked: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 1.5,
      borderColor: themeColors.lightGrey,
    },
  });
};
