import { FONTS } from "@/src/shared/const";
import { useThemeStore } from "@/src/shared/store";
import { PlusIcon } from "@/src/shared/ui/icons";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { styles } from "./FilterInput.styles";

interface FilterInputProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerStyle?: any;
  inputStyle?: any;
  placeholder?: string;
}

const FilterInput = React.memo(
  ({
    value,
    onChangeText,
    onClear,
    containerStyle,
    inputStyle,
    placeholder,
    ...props
  }: FilterInputProps) => {
    const { colors } = useThemeStore();
    const inputRef = useRef<TextInput>(null);

    // Управление фокусом при изменении состояния расширения
    useEffect(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    // Мемоизируем обработчик очистки
    const handleClear = useCallback(() => {
      onChangeText("");
      onClear?.();
    }, [onChangeText, onClear]);

    // Мемоизируем стили инпута для предотвращения пересчета
    const inputStyles = useMemo(
      () => [
        styles.input,
        { color: colors.contrast },
        {
          maxWidth: "92%",
          fontSize: 16,
          fontFamily: FONTS.regular,
        },
        inputStyle,
      ],
      [colors.contrast, inputStyle]
    );

    // Мемоизируем цвет плейсхолдера
    const placeholderTextColor = useMemo(
      () => `${colors.contrast}80`,
      [colors.contrast]
    );

    // Мемоизируем стили контейнера
    const containerStyles = useMemo(
      () => [styles.container, containerStyle],
      [containerStyle]
    );

    return (
      <View style={containerStyles}>
        <TextInput
          ref={inputRef}
          style={inputStyles}
          value={value}
          maxLength={40}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          keyboardType="default"
          {...props}
        />
        {value && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <PlusIcon size={26} color={colors.contrast} />
          </Pressable>
        )}
      </View>
    );
  }
);

FilterInput.displayName = "FilterInput";

export default FilterInput;
