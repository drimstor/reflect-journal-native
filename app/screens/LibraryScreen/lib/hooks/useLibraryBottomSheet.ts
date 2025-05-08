import { useMemo, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useBottomSheetNavigation } from "@/src/shared/ui/BottomSheetContent";
import { useDeviceStore } from "@/src/shared/store";

export const useLibraryBottomSheet = () => {
  const { window } = useDeviceStore();
  const navigation = useNavigation();
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
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        snapToIndex(0);
      }, 260);
    });

    return unsubscribe;
  }, [navigation, snapToIndex]);

  return {
    bottomSheetRef,
    bottomSheetIndex,
    snapToIndex,
    snapPoints,
  };
};
