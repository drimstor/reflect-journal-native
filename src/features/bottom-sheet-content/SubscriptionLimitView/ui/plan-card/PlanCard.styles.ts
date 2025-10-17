import { FONTS } from "@/src/shared/const";
import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 280,
      marginHorizontal: 8,
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.alternate,
      backgroundColor: colors.secondary,
    },
    activeCard: {
      borderColor: colors.accent,
      backgroundColor: colors.primary + "10",
    },
    header: {
      marginBottom: 16,
    },
    planName: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      color: colors.contrast,
      marginBottom: 4,
    },
    currentBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.accent + "20",
    },
    currentText: {
      fontSize: 12,
      fontFamily: FONTS.regular,
      color: colors.accent,
    },
    featuresContainer: {
      gap: 12,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
      marginTop: 7,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      fontFamily: FONTS.regular,
      color: colors.contrast,
      lineHeight: 20,
    },
  });
