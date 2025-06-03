import { useEffect, useState, RefObject } from "react";
import { ScrollView } from "react-native";
import { useKeyboard } from "./useKeyboard";

interface UseKeyboardAnimateActionProps {
  scrollViewRef: RefObject<ScrollView | null>;
}

export const useKeyboardAnimateAction = ({
  scrollViewRef,
}: UseKeyboardAnimateActionProps) => {
  const { isKeyboardVisible } = useKeyboard();

  const [isKeyboardVisibleDelayed, setIsKeyboardVisibleDelayed] =
    useState(isKeyboardVisible);

  useEffect(() => {
    if (isKeyboardVisible) {
      setIsKeyboardVisibleDelayed(true);
    } else {
      const timer = setTimeout(() => {
        setIsKeyboardVisibleDelayed(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isKeyboardVisible]);

  // Прокрутка при появлении клавиатуры
  useEffect(() => {
    if (isKeyboardVisible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }
  }, [isKeyboardVisible, scrollViewRef]);

  return {
    isKeyboardVisibleDelayed,
  };
};
