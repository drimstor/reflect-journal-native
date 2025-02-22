import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    layoutWrapper: {
      backgroundColor: theme.background,
    },
  });
};

export const paddingStyles = StyleSheet.create({
  paddingWrapper: {},
});
