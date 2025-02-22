import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors, padding: number) =>
  StyleSheet.create({
    globalBox: {
      padding,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
    },
    subTitleBox: {
      marginTop: 4,
    },
    progressBarBox: {
      marginTop: 6,
    },
    progressBarTextBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
  });
