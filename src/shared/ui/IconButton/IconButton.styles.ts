import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    touchableOpacity: {
      width: 55,
      height: 55,
      backgroundColor: theme.contrastReverse,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      borderWidth: 1,
      borderColor: theme.alternate,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
    },
  });
};
