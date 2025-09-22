import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      // Основной контейнер сетки
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start",
    },

    imageContainer: {
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
      backgroundColor: colors.light,
    },

    image: {
      borderRadius: 8,
    },

    moreOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },

    moreText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "bold",
    },

    loaderContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
      borderWidth: 1,
      borderColor: colors.alternate,
    },
  });
