import LottieView from "lottie-react-native";
import { FC } from "react";
import { View } from "react-native";
import { useThemeStore } from "../../store";
import { LoaderProps } from "./model/types";

// Импортируем JSON анимацию
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import loadingDarkAnimation from "./animations/slow-spinner-dark.json";
import loadingLightAnimation from "./animations/slow-spinner-light.json";

export const Loader: FC<LoaderProps> = ({
  size = WINDOW_WIDTH - 100,
  style,
  isVisible = true,
}) => {
  const { theme } = useThemeStore();

  if (!isVisible) return null;

  return (
    <View
      style={[
        {
          marginHorizontal: "auto",
          width: size,
          height: size,
        },
        style,
      ]}
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
