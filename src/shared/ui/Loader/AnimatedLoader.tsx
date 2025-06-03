import React from "react";
import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Loader } from "./Loader";

export interface AnimatedLoaderProps {
  /** Показывать ли лоадер */
  isVisible: boolean;
  /** Анимированный стиль */
  animatedStyle: any;
  /** Размер лоадера */
  size?: number;
  /** Цвет фона */
  backgroundColor?: string;
  /** Дополнительные стили для контейнера */
  containerStyle?: ViewStyle;
  /** Стили для позиционирования */
  positionStyle?: ViewStyle;
}

export const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  isVisible,
  animatedStyle,
  size = 100,
  backgroundColor,
  containerStyle,
  positionStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
}) => {
  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        backgroundColor && { backgroundColor },
        containerStyle,
        animatedStyle,
        positionStyle,
      ]}
    >
      <Loader size={size} />
    </Animated.View>
  );
};
