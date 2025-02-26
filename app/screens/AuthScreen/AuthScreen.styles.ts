import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      gap: 12,
      alignSelf: "center",
      marginVertical: "auto",
      transform: [{ translateY: -80 }],
    },
    rememberMeContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    rememberMeText: {
      fontSize: 13,
    },
    checkboxBox: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    forgotPassword: {
      fontSize: 13,
    },
    submitButton: {
      marginTop: 18,
    },
    separator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginVertical: 12,
    },
    line: {
      height: 1,
      width: "40%",
      backgroundColor: colors.contrast,
    },
    orText: {
      marginHorizontal: 16,
      minWidth: 30,
      textAlign: "center",
    },
  });
