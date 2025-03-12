import React, { FC } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { useThemeStore } from "../../store";
import { LoaderProps } from "./model/types";

// Импортируем JSON анимацию
import loadingAnimation from "./animations/small-loader.json";

export const SmallLoader: FC<LoaderProps> = ({
  size = 90,
  style,
  isVisible = true,
  color,
}) => {
  if (!isVisible) return null;
  const { colors } = useThemeStore();

  return (
    <View
      style={[{ marginHorizontal: "auto", width: size, height: size }, style]}
    >
      <LottieView
        source={loadingAnimation}
        style={{ width: size, height: size }}
        autoPlay
        loop
        colorFilters={[
          {
            keypath: "icon.Group 1.Stroke 1",
            color: color || colors.contrastReverse,
          },
          {
            keypath: "icon 2.Group 1.Stroke 1",
            color: color || colors.contrastReverse,
          },
        ]}
      />
    </View>
  );
};
