import { ThemeColors } from "@/src/shared/model/types";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Основные стили AuthScreen
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
    // Стили для логотипа и названия приложения
    logoContainer: {
      position: "absolute",
      top: 45,
      left: (WINDOW_WIDTH - (WINDOW_WIDTH - 300)) / 2,
      gap: 10,
    },
    logoImage: {
      height: WINDOW_WIDTH - 300,
      width: WINDOW_WIDTH - 300,
    },
    appNameText: {
      fontSize: 28,
      textAlign: "center",
      lineHeight: 32,
    },
    // Стили для OnboardingHeader
    welcomeText: {
      textAlign: "center",
      paddingTop: 25,
      fontSize: 28,
      position: "absolute",
      top: 40,
      left: 0,
      right: 0,
      zIndex: 1,
      height: 60,
    },
    onboardingCounter: {
      marginTop: 10,
      maxWidth: 350,
      alignSelf: "center",
    },
    // Стили для OnboardingSection
    onboardingSectionContainer: {
      marginTop: -20,
      paddingBottom: 50,
    },
    onboardingScrollView: {
      marginBottom: -17,
    },
    onboardingContent: {
      gap: 16,
      paddingBottom: 30,
      paddingTop: 18,
    },
    // Стили для SuccessOverlay
    successOverlay: {
      position: "absolute",
      top: (WINDOW_HEIGHT - 280) / 2,
      left: (WINDOW_WIDTH - 250) / 2,
      zIndex: 9,
    },
  });
