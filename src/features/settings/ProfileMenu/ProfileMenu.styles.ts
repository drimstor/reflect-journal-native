import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
    },
    avatarBox: {
      width: 75,
      height: 75,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.alternate,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 7,
      backgroundColor: colors.contrastReverse,
    },
    editButton: {
      marginTop: 12,
      borderRadius: 20,
    },
  });
