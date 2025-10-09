import { StyleSheet } from "react-native";
import { ThemeColors } from "../../../src/shared/model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    titleText: {
      marginBottom: 10,
      justifyContent: "center",
    },
    listItemPreviewBox: {
      gap: 8,
    },
    carousel: {
      marginBottom: 8,
      marginTop: 10,
    },
    filtersPanel: {
      paddingBottom: 18,
    },
    chipBox: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      paddingTop: 12,
      paddingBottom: 11,
    },
    activeDot: {
      position: "absolute",
      top: -4,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
      zIndex: 10,
    },
  });
