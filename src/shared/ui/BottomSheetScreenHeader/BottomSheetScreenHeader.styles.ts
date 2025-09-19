import { ThemeColors } from "@/src/shared/model/types";
import { Platform, StyleSheet } from "react-native";

export const headerStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    headerBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    pressableLeftBox: {
      minWidth: Platform.OS === "android" ? 0 : 58,
    },
    backButton: {
      marginRight: Platform.OS === "android" ? -10 : 0,
    },
    pressableRightBox: {
      minWidth: 58,
    },
    buttonLoaderBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      maxHeight: 22,
      maxWidth: 58,
      overflow: "hidden",
    },
    arrowBox: {
      transform: [{ rotate: "-90deg" }, { translateY: 3 }],
    },
  });
};
