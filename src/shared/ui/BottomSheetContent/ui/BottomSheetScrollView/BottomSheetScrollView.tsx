import { useKeyboard } from "@/src/shared/lib/hooks";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleProp, ViewStyle } from "react-native";

export const BottomSheetScrollView = ({
  children,
  additionalHeight = 135,
  customMaxHeight,
  style,
  customMinHeight,
}: {
  children: React.ReactNode;
  customMaxHeight?: number;
  additionalHeight?: number;
  style?: StyleProp<ViewStyle>;
  customMinHeight?: number;
}) => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const scrollViewRef = useRef<ScrollView>(null);

  const maxHeight = useMemo(
    () =>
      isKeyboardVisible
        ? WINDOW_HEIGHT - keyboardHeight - additionalHeight
        : customMaxHeight || "auto",
    [
      isKeyboardVisible,
      WINDOW_HEIGHT,
      keyboardHeight,
      customMaxHeight,
      additionalHeight,
    ]
  );

  const minHeight = useMemo(() => customMinHeight || "auto", [customMinHeight]);

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
    <ScrollView
      ref={scrollViewRef}
      style={[{ maxHeight, minHeight, paddingBottom }, style]}
    >
      {children}
    </ScrollView>
  );
};
