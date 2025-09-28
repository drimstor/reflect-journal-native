import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    layoutWrapper: {
      backgroundColor: theme.background,
    },
  });
};

export const settingsLayoutStyles = StyleSheet.create({
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 130,
  },
  formContainer: {
    marginTop: 30,
    gap: 18,
  },
});
