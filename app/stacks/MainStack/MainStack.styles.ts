import { Animated, StyleSheet } from "react-native";
import { ThemeColors, Theme } from "@/src/shared/model/types";

export const createStyles = (
  colors: ThemeColors,
  theme: Theme,
  isTablet: boolean,
  isAndroid: boolean,
  animation: Animated.Value
) => {
  return StyleSheet.create({
    tabBarStyle: {
      backgroundColor: colors.primary,
      position: "absolute",
      bottom: isTablet ? (isAndroid ? 120 : 60) : isAndroid ? 60 : 42,
      marginHorizontal: 40,
      height: 80,
      borderRadius: 40,
      paddingHorizontal: 12,
      borderWidth: 0.5,
      borderColor: theme === "dark" ? colors.secondary : colors.alternate + 50,
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [125, 0],
          }),
        },
      ],
      opacity: animation,
    },
    tabBarItemStyle: {
      top: isTablet ? (isAndroid ? 30 : 0) : 20,
    },
    plusIconBox: {
      backgroundColor: colors.white,
      borderWidth: 0,
      width: 60,
      height: 60,
    },
    leftIconBox: {
      marginRight: 18,
    },
    rightIconBox: {
      marginLeft: 18,
    },
  });
};
