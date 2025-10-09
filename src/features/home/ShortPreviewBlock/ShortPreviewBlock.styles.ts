import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, padding: number) =>
  StyleSheet.create({
    globalBox: {
      padding,
      borderRadius: 18,
      width: 310,
      height: 170,
      marginBottom: 8,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.alternate,
    },
    captionBox: {
      flexDirection: "row",
      gap: 4,
    },
    subTitleBox: {
      marginTop: 6,
      marginBottom: "auto",
      minHeight: 42,
    },
    progressBarBox: {
      marginTop: 16,
      marginBottom: 10,
    },
  });
