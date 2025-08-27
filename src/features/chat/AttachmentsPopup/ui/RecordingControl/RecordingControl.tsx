import { useThemeStore } from "@/src/shared/store";
import React, { FC, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { createStyles } from "./RecordingControl.styles";

interface RecordingControlProps {
  isVisible: boolean;
  isPaused: boolean;
  recordingTime: number;
  error: string | null;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const RecordingControl: FC<RecordingControlProps> = ({
  isVisible,
  isPaused,
  recordingTime,
  error,
  onPause,
  onResume,
  onStop,
}) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);

  const animationValue = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    animationValue.value = withSpring(isVisible ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isVisible]);

  // Анимация пульсации для индикатора записи
  useEffect(() => {
    if (!isPaused && isVisible) {
      pulseAnimation.value = withRepeat(
        withTiming(1.3, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseAnimation.value = withTiming(1, { duration: 300 });
    }
  }, [isPaused, isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationValue.value, [0, 1], [100, 0]);
    const opacity = animationValue.value;

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Стиль для анимации пульсации точки
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
      opacity: interpolate(pulseAnimation.value, [1, 1.3], [1, 0.6]),
    };
  });

  // Форматирование времени в MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content}>
        {/* Индикатор записи */}
        <View style={styles.recordingIndicator}>
          <Animated.View
            style={[
              styles.recordingDot,
              !isPaused && styles.recordingDotActive,
              !isPaused && pulseStyle,
            ]}
          />
          <Text style={styles.timeText}>{formatTime(recordingTime)}</Text>
        </View>

        {/* Кнопки управления */}
        <View style={styles.controls}>
          {/* Кнопка паузы/воспроизведения */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={isPaused ? onResume : onPause}
          >
            <Text style={styles.controlButtonText}>
              {isPaused ? "▶️" : "⏸️"}
            </Text>
          </TouchableOpacity>

          {/* Кнопка остановки */}
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={onStop}
          >
            <Text style={styles.controlButtonText}>⏹️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Отображение ошибки */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
};
