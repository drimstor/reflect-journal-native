import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const createStyles = (colors: ThemeColors, size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: 8,
      backgroundColor: colors.light,
      borderColor: colors.alternate,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    iconWrapper: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      borderRadius: size * 0.25,
      width: size * 0.5,
      height: size * 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    iconWrapperActive: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  });
