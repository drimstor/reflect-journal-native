import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { useBottomSheetNavigation } from "@/src/shared/ui/BottomSheetContent";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo } from "react";

export const useLibraryBottomSheet = () => {
  const { window } = useDeviceStore();
  const isFocused = useIsFocused();
  const { bottomSheetRef, bottomSheetIndex, snapToIndex } =
    useBottomSheetIndexState();

  // Инициализируем навигацию для BottomSheet
  useBottomSheetNavigation();

  const windowHeight = window.height;

  // Вычисляем точки привязки для BottomSheet
  const snapPoints = useMemo(() => {
    return [windowHeight - 203, windowHeight - 85, windowHeight];
  }, [windowHeight]);

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
