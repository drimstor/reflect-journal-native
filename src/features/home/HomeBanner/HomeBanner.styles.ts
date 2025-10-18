import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      paddingTop: 10,
    },
    bannerBox: {
      borderRadius: 18,
      padding: 16,
      gap: 6,
      paddingLeft: 18,
      height: 100,
      overflow: "hidden",
      paddingRight: 115,
    },
    giftImage: {
      width: 150,
      height: 150,
      position: "absolute",
      right: -25,
      bottom: -45,
    },
    starImage: {
      width: 140,
      height: 140,
      position: "absolute",
      right: -22,
      bottom: -30,
    },
    star: {
      height: 118,
    },
    starText: {
      marginLeft: -2,
    },
  });
