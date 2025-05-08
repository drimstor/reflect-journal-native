import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const itemCarouselStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    carouselContainer: {
      marginTop: 8,
      marginBottom: 12,
    },
    carouselTitleText: {
      marginBottom: 8,
    },
  });
};
