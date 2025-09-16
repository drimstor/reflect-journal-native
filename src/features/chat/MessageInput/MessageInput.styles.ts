import { FONTS } from "@/src/shared/const";
import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    container: {
      transform: [{ translateY: -44 }],
      position: "relative",
    },
    toolbar: {
      backgroundColor: "transparent",
      padding: 8,
      paddingHorizontal: 13,
      marginBottom: 25,
      borderTopWidth: 0,
      borderColor: colors.alternate,
    },
    composerContainerWrapper: {
      backgroundColor: theme === "light" ? colors.white : colors.secondary,
      borderColor: colors.alternate,
      borderRadius: 30,
      borderWidth: 1,
      padding: 10,
      gap: 8,
      width: "100%",
    },
    composerContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      color: colors.contrast,
      backgroundColor:
        theme === "light" ? colors.light + 80 : colors.black + 20,
      borderColor: colors.alternate,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      fontFamily: FONTS.regular,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
    },
  });
