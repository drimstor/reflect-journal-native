import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    moodButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      minWidth: 68,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.alternate,
      backgroundColor: colors.light,
    },
    selectedMoodButton: {
      borderColor: colors.accent,
      backgroundColor: colors.accent + "30",
    },
    emoji: {
      fontSize: 24,
      lineHeight: 28,
    },
    label: {
      fontSize: 12,
    },
  });
