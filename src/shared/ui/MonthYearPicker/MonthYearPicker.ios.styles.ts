import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 10,
      flexShrink: 1,
      width: "100%",
    },
    // Стили для анимированного контейнера
    animatedContainer: {
      borderWidth: 1,
      borderColor: colors.alternate,
      width: "100%",
      overflow: "hidden",
    },
    // Стили для Pressable внутри
    pressableContainer: {
      width: "100%",
    },
    // Стили для превью части
    previewSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    previewText: {
      fontSize: 15,
      lineHeight: 17,
      color: colors.contrast,
      flex: 1,
      fontFamily: "ZonaPro-Regular",
    },
    previewPlaceholder: {
      fontSize: 15,
      lineHeight: 17,
      color: colors.contrast + "80",
      flex: 1,
    },
    arrowIcon: {
      marginLeft: 8,
    },
    // Контейнер для всех picker'ов
    pickersContainer: {
      flexDirection: "row",
      width: "100%",
      borderTopWidth: 1,
      borderColor: colors.alternate,
      marginTop: -2,
    },
    // Стили для отдельных picker'ов
    pickerWrapper: {
      flex: 1,
    },
    dayPicker: {
      flex: 0.6, // Меньше места для дня
    },
    monthPicker: {
      flex: 1.2, // Больше места для месяца
    },
    yearPicker: {
      flex: 0.8, // Средне место для года
    },
    picker: {
      height: 175,
    },
    helperText: {
      marginTop: 4,
      marginLeft: 4,
      opacity: 0.7,
    },
  });

// Размеры для превью поля
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
