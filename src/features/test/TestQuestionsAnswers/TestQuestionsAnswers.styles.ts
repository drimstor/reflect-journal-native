import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 4,
    },

    titleText: {
      marginBottom: 16,
    },

    questionContainer: {
      marginBottom: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.alternate,
    },

    questionRow: {
      marginBottom: 12,
    },

    label: {
      marginBottom: 2,
    },

    expandButtonContainer: {
      marginTop: 4,
      alignItems: "center",
    },
  });
