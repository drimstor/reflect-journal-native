import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    pressableArea: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  });
};
