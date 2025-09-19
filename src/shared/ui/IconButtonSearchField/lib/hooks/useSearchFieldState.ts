import { useKeyboard, useToggle } from "@/src/shared/lib/hooks";
import { useEffect, useRef } from "react";
import { TextInput } from "react-native";

interface UseSearchFieldStateProps {
  value: string;
  onChangeText?: (text: string) => void;
}

export const useSearchFieldState = ({
  value,
  onChangeText,
}: UseSearchFieldStateProps) => {
  const inputRef = useRef<TextInput>(null);
  const isFirstRender = useRef(true);
  const { isKeyboardVisible } = useKeyboard();
  // Проверка, пустое ли поле
  const isEmpty = value.length === 0;

  // Состояние расширения поля
  const { value: isExpanded, toggle: toggleIsExpanded } = useToggle(false);

  // Состояние фокуса
  const { value: isFocused, toggle: toggleIsFocused } = useToggle(false);

  // Автоматически сворачиваем поле, если клавиатура скрыта и поле пустое
  useEffect(() => {
    if (!isKeyboardVisible && isEmpty && isExpanded) {
      toggleIsExpanded(false);
    }
  }, [isKeyboardVisible]);

  // Управление фокусом при изменении состояния расширения
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isExpanded) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        toggleIsFocused(true);
      });
    } else {
      toggleIsFocused(false);
    }
  }, [isExpanded, toggleIsFocused]);

  // Обработчик переключения состояния
  const handleToggle = () => {
    onChangeText?.("");
    toggleIsExpanded();
  };

  return {
    inputRef,
    isExpanded,
    isFocused,
    isEmpty,
    handleToggle,
  };
};
