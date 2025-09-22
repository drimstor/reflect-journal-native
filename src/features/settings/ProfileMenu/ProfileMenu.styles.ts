import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    },
    avatarBox: {
      width: 75,
      height: 75,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.alternate,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 6,
      backgroundColor: colors.contrastReverse,
      overflow: "hidden",
    },
    editButton: {
      marginTop: 12,
      borderRadius: 20,
    },
    imageLoadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
  });
