import { BOTTOM_SHEET_SCREEN_POINTS } from "@/src/shared/const";
import { useBottomSheetIndexState, useKeyboard } from "@/src/shared/lib/hooks";
import { useBottomSheetStore } from "@/src/shared/store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Variant } from "../../model/types";

interface UseAuthBottomSheetProps {
  setVariant: (variant: Variant) => void;
}

/**
 * Хук для управления BottomSheet в AuthScreen
 * Обрабатывает snap points с учетом клавиатуры и инициализирует экран
 */
export const useAuthBottomSheet = ({ setVariant }: UseAuthBottomSheetProps) => {
  const { bottomSheetRef, snapToIndex, bottomSheetIndex } =
    useBottomSheetIndexState();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const { bottomSheetHeight } = useBottomSheetStore();
  const { MEDIUM } = BOTTOM_SHEET_SCREEN_POINTS;

  // Вычисляет snap points с учетом клавиатуры
  const getSnapPoints = useCallback(() => {
    const baseHeight = bottomSheetHeight ? bottomSheetHeight : 0.01;
    return [baseHeight + (isKeyboardVisible ? keyboardHeight - 45 : 0), MEDIUM];
  }, [keyboardHeight, isKeyboardVisible, bottomSheetHeight, MEDIUM]);

  // Инициализация экрана при фокусе
  useFocusEffect(
    useCallback(() => {
      snapToIndex(0);
      setVariant("splash");
    }, [snapToIndex, setVariant])
  );

  return {
    bottomSheetRef,
    snapToIndex,
    getSnapPoints,
    bottomSheetIndex,
  };
};
