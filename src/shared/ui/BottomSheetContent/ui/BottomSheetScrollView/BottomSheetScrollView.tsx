import { useKeyboard } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native";

export const BottomSheetScrollView = ({
  children,
  additionalHeight = 135,
  customMaxHeight,
}: {
  children: React.ReactNode;
  customMaxHeight?: number;
  additionalHeight?: number;
}) => {
  const { window } = useDeviceStore();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const scrollViewRef = useRef<ScrollView>(null);

  const maxHeight = useMemo(
    () =>
      isKeyboardVisible
        ? window.height - keyboardHeight - additionalHeight
        : customMaxHeight || "auto",
    [
      isKeyboardVisible,
      window.height,
      keyboardHeight,
      customMaxHeight,
      additionalHeight,
    ]
  );

  const paddingBottom = useMemo(
    () => (isKeyboardVisible ? 15 : 0),
    [isKeyboardVisible]
  );

  // Автоматическая прокрутка вниз при открытии клавиатуры
  useEffect(() => {
    if (isKeyboardVisible && scrollViewRef.current) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [isKeyboardVisible]);

  return (
    <ScrollView ref={scrollViewRef} style={{ maxHeight, paddingBottom }}>
      {children}
    </ScrollView>
  );
};
