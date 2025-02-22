import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";
import { Animated } from "react-native";

export const createStyles = (colors: ThemeColors, animation: Animated.Value) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      paddingTop: 10,
      zIndex: 1,
      opacity: animation,
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-15, 0],
          }),
        },
      ],
    },
  });
