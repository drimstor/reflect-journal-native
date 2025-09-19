import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 160,
      right: 12,
      zIndex: 1000,
    },
    iconContainer: {
      transform: [{ rotate: "-90deg" }], // Поворачиваем ArrowLeftIcon на 90 градусов для стрелки вниз
    },
  });
