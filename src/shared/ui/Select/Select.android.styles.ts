import { ThemeColors } from "@/src/shared/model/types";
import { Platform, StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    selectWrapper: {
      // marginBottom: 8,
    },
    selectContainer: {
      paddingLeft: Platform.OS === "android" ? 8 : 0,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.alternate,
      marginTop: 8,
      overflow: "hidden",
      minHeight: 50,
      justifyContent: "center",
    },
    picker: {
      ...Platform.select({
        ios: {
          marginTop: -50,
          height: 170,
        },
        android: {
          height: 50,
          marginTop: 0,
        },
      }),
      fontSize: 16,
      color: colors.contrast,
    },
    helperText: {
      marginTop: 4,
      marginLeft: 4,
      opacity: 0.7,
    },
  });
