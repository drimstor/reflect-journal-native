import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    drawerContainer: {
      backgroundColor: themeColors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: 300,
      gap: 25,
      paddingHorizontal: 20,
      alignItems: "center",
      overflow: "hidden",
    },
    modalHandle: {
      width: 32,
      height: 4,
      backgroundColor: themeColors.secondary,
      borderRadius: 2,
      marginTop: 15,
    },
  });
};
