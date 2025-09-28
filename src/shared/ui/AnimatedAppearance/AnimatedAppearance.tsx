import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedAppearanceProps {
  /** Содержимое для анимированного отображения */
  children: React.ReactNode;
  /** Флаг, указывающий, должно ли содержимое быть видимым */
  isVisible?: boolean;
  /** Продолжительность анимации в мс (по умолчанию 300) */
  duration?: number;
  /** Продолжительность анимации скрытия в мс (по умолчанию 300) */
  durationOut?: number;
  /** Задержка перед началом анимации в мс (по умолчанию 100) */
  delay?: number;
  /** Дополнительные стили для контейнера */
  style?: any;
  /** Значение непрозрачности после анимации (по умолчанию 1) */
  targetOpacity?: number;
  /** Флаг, указывающий, должно ли содержимое быть видимым изначально */
  isInitialVisible?: boolean;
}

/**
 * Компонент для анимированного появления содержимого по условию
 */
const AnimatedAppearance: React.FC<AnimatedAppearanceProps> = ({
  children,
  isVisible,
  duration = 300,
  durationOut = 300,
  delay = 100,
  style,
  targetOpacity = 1,
  isInitialVisible,
}) => {
  // Значение непрозрачности для анимации
  const opacity = useSharedValue(isVisible ? 1 : 0);

  // Эффект для управления переходом видимости
  useEffect(() => {
    if (isVisible || isInitialVisible) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(targetOpacity, { duration });
      }, delay);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(0, { duration: durationOut });
    }
  }, [
    isVisible,
    duration,
    delay,
    targetOpacity,
    durationOut,
    isInitialVisible,
  ]);

  // Анимированный стиль для плавного появления
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

export default AnimatedAppearance;
