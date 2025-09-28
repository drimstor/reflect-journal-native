import LottieView from "lottie-react-native";
import { FC } from "react";
import { View } from "react-native";
import { useThemeStore } from "../../store";
import { LoaderProps } from "./model/types";

// Импортируем JSON анимацию
import loadingAnimation from "./animations/small-loader.json";

export const SmallLoader: FC<LoaderProps> = ({
  size = 50,
  style,
  isVisible = true,
  color,
}) => {
  // Хук должен вызываться всегда, до условного возврата
  const { colors } = useThemeStore();

  if (!isVisible) return null;

  return (
    <View
      style={[
        {
          marginHorizontal: "auto",
          width: size,
          height: size,
          transform: [{ scale: 1.8 }],
          maxHeight: size,
        },
        style,
      ]}
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
