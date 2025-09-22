import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    selectWrapper: {
      gap: 8,
      flexShrink: 1,
      width: "100%",
    },
    // Стили для анимированного контейнера (общий)
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
      fontFamily: "ZonaPro-Regular",
    },
    arrowIcon: {
      marginLeft: 8,
    },
    pickerWrapper: {
      marginTop: -2,
      borderTopWidth: 1,
      borderColor: colors.alternate,
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
