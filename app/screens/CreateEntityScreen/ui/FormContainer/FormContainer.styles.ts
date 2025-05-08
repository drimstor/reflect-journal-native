import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const formContainerStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      gap: 16,
      paddingBottom: 16,
    },
  });
};
