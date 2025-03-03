import React, { FC } from "react";
import { View, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";
import { useThemeStore } from "../../store";

// Импортируем JSON анимацию
import loadingDarkAnimation from "./animations/slow-spinner-dark.json";
import loadingLightAnimation from "./animations/slow-spinner-light.json";

interface LoaderProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  isVisible?: boolean;
}

export const Loader: FC<LoaderProps> = ({
  size = 50,
  style,
  isVisible = true,
}) => {
  if (!isVisible) return null;
  const { theme } = useThemeStore();

  return (
    <View
      style={[{ marginHorizontal: "auto", width: size, height: size }, style]}
    >
      <LottieView
        source={
          theme === "light" ? loadingLightAnimation : loadingDarkAnimation
        }
        style={{ width: size, height: size }}
        autoPlay
        loop
      />
    </View>
  );
};
