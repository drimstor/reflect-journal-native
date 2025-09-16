import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";
import { useThemeStore } from "../../store";

const { error } = useThemeStore.getState().colors;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      gap: 8,
    },
    imageWrapper: {
      position: "relative",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: colors.light,
      borderColor: colors.alternate,
      borderWidth: 1,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },

    image: {
      width: 60,
      height: 60,
    },

    imageInfo: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingHorizontal: 4,
      paddingVertical: 2,
    },

    fileName: {
      fontSize: 8,
      color: "#FFFFFF",
      fontWeight: "500",
    },

    fileSize: {
      fontSize: 8,
      color: "#CCCCCC",
      marginTop: 1,
    },

    removeButton: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: error,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.white,
      transform: [{ rotate: "45deg" }],
    },

    moreImagesContainer: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.light,
      borderColor: colors.alternate,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    moreImagesPlus: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      borderRadius: 15,
      width: 30,
      height: 30,
      padding: 3.5,
    },

    loaderContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 8,
      zIndex: 1,
    },
  });
