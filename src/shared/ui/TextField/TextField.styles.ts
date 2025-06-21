import { ThemeColors } from "@/src/shared/model/types";
import { Platform, StyleSheet } from "react-native";

export const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    textFieldWrapper: {
      gap: 8,
      flexShrink: 1,
      width: "100%",
    },
    textFieldContainer: {
      gap: 4,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: themeColors.alternate,
      width: "100%",
    },
    multiline: {
      height: 150,
      alignItems: "flex-start",
    },
    superMultiline: {
      height: 220,
      alignItems: "flex-start",
    },
    textField: {
      fontSize: 15,
      lineHeight: 17,
      color: themeColors.contrast,
      width: "100%",
      flex: 1,
      minWidth: 0,
      height: "100%",
      padding: 16,
      fontFamily: "ZonaPro-Regular",
      ...Platform.select({
        android: {
          paddingVertical: 0,
          textAlignVertical: "top",
        },
      }),
    },
  });
};

export const sizeStyles = StyleSheet.create({
  small: {
    height: 32,
    borderRadius: 10,
  },
  medium: {
    height: 52,
    borderRadius: 12,
  },
});
