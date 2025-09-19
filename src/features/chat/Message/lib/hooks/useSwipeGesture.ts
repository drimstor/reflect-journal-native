import { useCallback } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";

interface SwipeGestureProps {
  onSwipeComplete: () => void;
  onSwipeStart: () => void;
  onSwipeEnd: () => void;
}

export const useSwipeGesture = ({
  onSwipeComplete,
  onSwipeStart,
  onSwipeEnd,
}: SwipeGestureProps) => {
  const translateX = useSharedValue(0);

  // Пороговое значение для активации действия (в пикселях)
  const SWIPE_THRESHOLD = 35;
  // Минимальное расстояние для начала свайпа
  const MIN_SWIPE_DISTANCE = 20;

  // Создаем функции-колбэки для использования в worklet
  const handleSwipeStart = useCallback(() => onSwipeStart(), [onSwipeStart]);
  const handleSwipeComplete = useCallback(
    () => onSwipeComplete(),
    [onSwipeComplete]
  );
  const handleSwipeEnd = useCallback(() => onSwipeEnd(), [onSwipeEnd]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Активируется только при горизонтальном движении
    .failOffsetY([-10, 10]) // Отменяется при вертикальном движении
    .onStart(() => {
      "worklet";
      runOnJS(handleSwipeStart)();
    })
    .onUpdate((event) => {
      "worklet";
      // Ограничиваем свайп только горизонтальным направлением
      // Можно свайпать влево или вправо
      const absTranslationX = Math.abs(event.translationX);

      if (absTranslationX > MIN_SWIPE_DISTANCE) {
        // Ограничиваем максимальное смещение для лучшего UX
        const maxTranslation = SWIPE_THRESHOLD * 1.5;
        const clampedTranslation =
          Math.sign(event.translationX) *
          Math.min(absTranslationX, maxTranslation);

        translateX.value = clampedTranslation;
      }
    })
    .onEnd((event) => {
      "worklet";
      const absTranslationX = Math.abs(event.translationX);

      // Если свайп достиг порогового значения, активируем действие
      if (absTranslationX >= SWIPE_THRESHOLD) {
        runOnJS(handleSwipeComplete)();
      } else {
        runOnJS(handleSwipeEnd)();
      }

      // Возвращаем элемент в исходное положение
      translateX.value = withSpring(0, { damping: 15 });
    });

  return {
    panGesture,
    translateX,
  };
};
