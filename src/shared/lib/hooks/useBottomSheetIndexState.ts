import { useRef, useState, useCallback, useEffect } from "react";
import { BottomSheetRef } from "@/src/shared/ui/BottomSheet/BottomSheet";

/**
 * Хук для управления состоянием индекса BottomSheet компонента
 *
 * Позволяет:
 * - Получать текущий индекс снапа BottomSheet
 * - Изменять индекс снапа с сохранением состояния
 * - Наблюдать за изменениями индекса
 *
 * @returns {Object} Объект с методами и свойствами для работы с индексом BottomSheet
 */
export const useBottomSheetIndexState = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // Обновляем локальное состояние при каждом изменении индекса
  const updateIndex = useCallback(() => {
    if (bottomSheetRef.current) {
      const index = bottomSheetRef.current.getCurrentIndex();
      setCurrentIndex(index);
    }
  }, []);

  // Устанавливаем новый индекс
  const snapToIndex = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    setCurrentIndex(index);
  }, []);

  // Закрываем BottomSheet
  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setCurrentIndex(-1);
  }, []);

  // Проверяем, полностью ли открыт BottomSheet (на последнем индексе)
  const isFullyExpanded = useCallback(
    (snapPointsLength: number) => {
      return currentIndex === snapPointsLength - 1;
    },
    [currentIndex]
  );

  // Проверяем, находится ли BottomSheet в промежуточном состоянии
  const isPartiallyExpanded = useCallback(() => {
    return currentIndex > 0 && currentIndex < 1;
  }, [currentIndex]);

  // Проверяем, закрыт ли BottomSheet
  const isClosed = useCallback(() => {
    return currentIndex === -1;
  }, [currentIndex]);

  return {
    bottomSheetRef,
    bottomSheetIndex: currentIndex,
    snapToIndex,
    closeBottomSheet,
    updateIndex,
    isFullyExpanded,
    isPartiallyExpanded,
    isClosed,
  };
};
