import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors, padding: number) =>
  StyleSheet.create({
    globalBox: {
      padding,
      paddingTop: 18,
      borderRadius: 32,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      marginHorizontal: 10,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textBox: {
      gap: 6,
    },
    iconBox: {},
    title: {
      fontSize: 27,
    },
    subTitle: {
      fontSize: 16,
    },
  });
