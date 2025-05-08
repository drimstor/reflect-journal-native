import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

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
      minWidth: 58,
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
  });
};
