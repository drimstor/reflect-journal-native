import { BOTTOM_SHEET_SCREEN_POINTS } from "@/src/shared/const";
import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useBottomSheetNavigation } from "@/src/shared/ui/BottomSheetContent";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo } from "react";

export const useLibraryBottomSheet = () => {
  const { FULL, LARGE, MEDIUM } = BOTTOM_SHEET_SCREEN_POINTS;
  const isFocused = useIsFocused();
  const { bottomSheetRef, bottomSheetIndex, snapToIndex } =
    useBottomSheetIndexState();

  // Инициализируем навигацию для BottomSheet
  useBottomSheetNavigation();

  // Вычисляем точки привязки для BottomSheet
  const snapPoints = useMemo(
    () => [MEDIUM, LARGE, FULL],
    [FULL, LARGE, MEDIUM]
  );

  // Устанавливаем обработчик фокуса для сброса позиции BottomSheet
  useEffect(() => {
    if (isFocused && bottomSheetIndex !== 2) {
      requestAnimationFrame(() => {
        snapToIndex(0);
      });
    }
  }, [isFocused]);

  return {
    bottomSheetRef,
    bottomSheetIndex,
    snapToIndex,
    snapPoints,
  };
};
