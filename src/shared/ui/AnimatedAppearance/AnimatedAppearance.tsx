import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedAppearanceProps {
  /** Содержимое для анимированного отображения */
  children: React.ReactNode;
  /** Флаг, указывающий, должно ли содержимое быть видимым */
  isVisible: boolean;
  /** Продолжительность анимации в мс (по умолчанию 300) */
  duration?: number;
  /** Задержка перед началом анимации в мс (по умолчанию 100) */
  delay?: number;
  /** Дополнительные стили для контейнера */
  style?: any;
  /** Значение непрозрачности после анимации (по умолчанию 1) */
  targetOpacity?: number;
}

/**
 * Компонент для анимированного появления содержимого по условию
 */
const AnimatedAppearance: React.FC<AnimatedAppearanceProps> = ({
  children,
  isVisible,
  duration = 300,
  delay = 100,
  style,
  targetOpacity = 1,
}) => {
  // Значение непрозрачности для анимации
  const opacity = useSharedValue(isVisible ? 1 : 0);

  // Эффект для управления переходом видимости
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(targetOpacity, { duration });
      }, delay);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(0, { duration });
    }
  }, [isVisible, duration, delay, targetOpacity]);

  // Анимированный стиль для плавного появления
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

export default AnimatedAppearance;
