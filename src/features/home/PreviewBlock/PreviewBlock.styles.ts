import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors, padding: number) =>
  StyleSheet.create({
    globalBox: {
      padding,
      backgroundColor: colors.secondary,
      borderRadius: 18,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.alternate,
    },
    infoTableBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    subTitleBox: {
      marginVertical: 12,
    },
  });
