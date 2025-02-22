import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";
import { Animated } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    titleBox: {
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 8,
      marginBottom: 18,
    },
    subTitleBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      paddingRight: 8,
    },
    infoTableBox: {
      flexDirection: "row",
      gap: 8,
      paddingVertical: 4,
    },
    titleText: {
      marginBottom: 10,
      marginRight: 8,
    },
    globalViewHorizontal: {
      paddingBottom: 200,
    },
    divider: {
      marginVertical: 24,
    },
    animatedView: {
      // opacity: 0,
    },
    pullIcon: {
      position: "absolute",
      top: -10,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 1000,
    },
  });
