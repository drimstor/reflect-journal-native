import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      // marginBottom: 8,
    },
    selectsContainer: {
      flexDirection: "row",
      gap: 4,
      marginTop: 2,
    },
    selectWrapper: {
      flex: 1,
    },
    daySelect: {
      flex: 0.62, // Меньше места для дня
    },
    monthSelect: {
      flex: 1.2, // Больше места для месяца
    },
    yearSelect: {
      flex: 0.8, // Средне место для года
    },
    helperText: {
      marginTop: 4,
      marginLeft: 4,
      opacity: 0.7,
    },
  });
