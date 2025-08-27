import React, { FC } from "react";
import { View } from "react-native";
// import LottieView from "lottie-react-native";
import { useThemeStore } from "../../store";
import { LoaderProps } from "./model/types";

// Импортируем JSON анимацию
// import loadingAnimation from "./animations/message-loader.json";

export const MessageLoader: FC<LoaderProps> = ({
  size = 180,
  style,
  isVisible = true,
  color,
}) => {
  if (!isVisible) return null;
  const { colors } = useThemeStore();

  return (
    <View
      style={[
        { marginHorizontal: "auto", width: size, height: size / 2 },
        style,
      ]}
    >
      {/* <LottieView
        source={loadingAnimation}
        style={{ width: size, height: size / 2 }}
        autoPlay
        loop
        colorFilters={[
          {
            keypath: "Shape Layer 6.**",
            color: colors.contrast || "#cccccc",
          },
        ]}
      /> */}
    </View>
  );
};
