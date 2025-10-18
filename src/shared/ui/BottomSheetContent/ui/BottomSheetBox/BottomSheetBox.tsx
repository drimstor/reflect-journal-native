import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { useCallback, useRef } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";

interface BottomSheetBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const BottomSheetBox = ({ children, style }: BottomSheetBoxProps) => {
  const { setBottomSheetHeight } = useBottomSheetStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce для плавного изменения высоты после анимаций
  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const newHeight = e.nativeEvent.layout.height;

      if (newHeight > 0) {
        // Очищаем предыдущий таймер
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Устанавливаем новый таймер
        timeoutRef.current = setTimeout(() => {
          requestAnimationFrame(() => {
            setBottomSheetHeight(newHeight);
          });
        }, 50); // Немного больше чем duration анимации селекта (300ms)
      }
    },
    [setBottomSheetHeight]
  );

  return (
    <View
      style={[{ gap: 4, paddingBottom: 60 }, style]}
      onLayout={handleLayout}
    >
      {children}
    </View>
  );
};

export default BottomSheetBox;
