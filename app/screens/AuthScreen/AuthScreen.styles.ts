import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    formBox: {
      gap: 16,
      paddingBottom: 60,
    },
    rememberMeContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    haveAccountContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: 4,
      marginTop: 8,
      marginHorizontal: "auto",
    },
    separator: {
      opacity: 0.55,
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
      marginTop: 10,
    },
    socialsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      gap: 24,
    },
    bottomSheet: {
      paddingTop: 16,
    },
  });
