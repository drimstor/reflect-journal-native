import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const createStyles = (colors: ThemeColors, top: number) =>
  StyleSheet.create({
    positionBox: {
      position: "absolute",
      top: top + 8,
      left: 24,
      right: 24,
      zIndex: 1000,
    },
    container: {
      padding: 12,
      paddingVertical: 13,
      gap: 12,
      borderRadius: 16,
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.alternate,
    },
    text: {
      marginTop: -4,
    },
  });
