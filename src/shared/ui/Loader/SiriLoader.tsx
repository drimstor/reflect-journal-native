import React, { FC } from "react";
import { Animated, View } from "react-native";
import LottieView from "lottie-react-native";
import { LoaderProps } from "./model/types";

// Импортируем JSON анимацию
import siriAnimation from "./animations/siri.json";

export const SiriLoader: FC<LoaderProps> = ({
  size = 50,
  style,
  isVisible = true,
}) => {
  if (!isVisible) return null;
  return (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <LottieView
        source={siriAnimation}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        loop
      />
    </Animated.View>
  );
};
