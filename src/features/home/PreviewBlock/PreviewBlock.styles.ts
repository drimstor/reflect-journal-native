import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      padding: 24,
      paddingVertical: 20,
      backgroundColor: colors.secondary,
      borderRadius: 18,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.alternate,
      overflow: "hidden",
    },
    infoTableBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    titleBox: {
      marginBottom: 12,
    },
    subTitleBox: {
      marginBottom: 12,
    },
    tagsBox: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    backgroundIconBox: {
      position: "absolute",
      bottom: -85,
      right: -70,
      opacity: 0.05,
    },
  });
