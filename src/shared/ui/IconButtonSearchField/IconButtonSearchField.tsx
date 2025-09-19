import { useThemeStore } from "@/src/shared/store";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  TextInput,
  ViewStyle,
} from "react-native";
import { useDebounce, useT } from "../../lib/hooks";
import { PlusIcon, SearchIcon } from "../icons";
import { createStyles } from "./IconButtonSearchField.styles";
import { useAnimation } from "./lib/hooks/useAnimation";
import { useSearchFieldLayout } from "./lib/hooks/useSearchFieldLayout";
import { useSearchFieldState } from "./lib/hooks/useSearchFieldState";

interface IconButtonSearchFieldProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
}

const IconButtonSearchField: FC<IconButtonSearchFieldProps> = ({
  style,
  value = "",
  onChangeText,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const styles = useMemo(() => createStyles(colors, theme), [theme]);
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue);

  // Используем хук для управления состоянием поля поиска
  const { inputRef, isExpanded, isFocused, isEmpty, handleToggle } =
    useSearchFieldState({
      value: localValue,
      onChangeText: (text) => {
        setLocalValue(text);
        onChangeText(text);
      },
    });

  useEffect(() => {
    if (debouncedValue !== value) {
      onChangeText(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (!value) {
      setLocalValue("");
    }
  }, [value]);

  // Используем хук для анимации
  const { animatedStyle } = useAnimation(isExpanded);

  // Используем хук для расчета размеров
  const { inputWidth } = useSearchFieldLayout({ isExpanded });

  return (
    <Animated.View style={[styles.globalBox, animatedStyle]}>
      <Pressable onPress={handleToggle} style={[style, styles.pressable]}>
        <SearchIcon color={colors.contrast} />
      </Pressable>

      {isExpanded && (
        <TextInput
          ref={inputRef}
          style={[
            styles.textField,
            { color: colors.contrast },
            { width: inputWidth },
          ]}
          value={localValue}
          maxLength={50}
          placeholder={t("shared.actions.search") + "..."}
          placeholderTextColor={`${colors.contrast}80`}
          onChangeText={setLocalValue}
          keyboardType={"default"}
        />
      )}
      {isFocused && !isEmpty && (
        <Pressable onPress={handleToggle} style={[style, styles.pressablePlus]}>
          <PlusIcon size={28} color={colors.contrast} />
        </Pressable>
      )}
    </Animated.View>
  );
};

export default IconButtonSearchField;
