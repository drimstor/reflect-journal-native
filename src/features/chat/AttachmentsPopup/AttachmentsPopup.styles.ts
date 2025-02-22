import { Theme, ThemeColors } from "@/src/shared/model/types";
import { Animated, StyleSheet } from "react-native";

export const createStyles = (
  colors: ThemeColors,
  theme: Theme,
  animation: Animated.Value
) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 70,
      right: -0.5,
      zIndex: 1000,
    },
    popup: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      borderWidth: 1,
      width: 60,
      gap: 10,
      padding: 10,
      borderColor: colors.alternate,
      backgroundColor: theme === "light" ? colors.white : colors.secondary,
      opacity: animation,
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme === "dark" ? colors.accent + 25 : colors.primary + 10,
    },
  });
