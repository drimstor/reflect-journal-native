import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors, padding: number) =>
  StyleSheet.create({
    globalBox: {
      padding: 14,
      paddingVertical: 10,
      borderRadius: 16,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.alternate,
    },
    textBox: {
      marginTop: -4,
      marginRight: "auto",
      paddingLeft: 14,
    },
    iconBox: {},
  });
