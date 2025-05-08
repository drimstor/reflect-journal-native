import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      // flex: 1,
      flexDirection: "column",
      // gap: 10,
    },
    listItemBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 14,
    },
    listTitle: {
      paddingLeft: 16,
      paddingBottom: 10,
    },
    listItemDefault: {
      justifyContent: "space-between",
    },
    listBox: {
      backgroundColor: colors.secondary,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.alternate,
      paddingHorizontal: 16,
      // flex: 1,
    },
    elementBox: {
      marginLeft: "auto",
      marginRight: 8,
    },
  });
