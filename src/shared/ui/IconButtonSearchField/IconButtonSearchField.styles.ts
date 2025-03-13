import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";
import { FONTS } from "../../const";

export const createStyles = (colors: ThemeColors, theme: Theme) => {
  return StyleSheet.create({
    globalBox: {
      width: 55,
      height: 55,
      backgroundColor:
        theme === "light" ? colors.light : colors.contrastReverse,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.alternate,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      position: "relative",
      overflow: "hidden",
    },
    pressable: {
      width: 55,
      height: 55,
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
    },
    pressablePlus: {
      width: 55,
      height: 55,
      position: "absolute",
      transform: [{ rotate: "45deg" }],
      alignSelf: "flex-end",
      alignItems: "center",
      justifyContent: "center",
    },
    textField: {
      position: "absolute",
      left: 53,
      fontSize: 16,
      fontFamily: FONTS.regular,
      color: colors.contrast,
    },
  });
};
