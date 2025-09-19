import { RefObject, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useKeyboard } from "./useKeyboard";

interface UseKeyboardAnimateActionProps {
  scrollViewRef: RefObject<ScrollView | null>;
}

export const useKeyboardAnimateAction = ({
  scrollViewRef,
}: UseKeyboardAnimateActionProps) => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const [isKeyboardVisibleDelayed, setIsKeyboardVisibleDelayed] =
    useState(isKeyboardVisible);

  useEffect(() => {
    if (isKeyboardVisible) {
      setIsKeyboardVisibleDelayed(true);
    } else {
      requestAnimationFrame(() => {
        setIsKeyboardVisibleDelayed(false);
      });
    }
  }, [isKeyboardVisible]);

  // Прокрутка при появлении клавиатуры
  useEffect(() => {
    if (isKeyboardVisible && scrollViewRef.current) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [isKeyboardVisible, scrollViewRef]);

  return {
    isKeyboardVisibleDelayed,
    keyboardHeight,
  };
};
