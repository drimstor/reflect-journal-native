import { useThemeStore } from "@/src/shared/store";
import { Chip, Text } from "@/src/shared/ui";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./ChipSelector.styles";

export interface ChipSelectorOption {
  label: string;
  value: string;
  color?: string; // Кастомный цвет чипсины
  activeColor?: string; // Кастомный цвет активных чипсин
}

export interface ChipSelectorProps {
  label?: string; // Заголовок компонента
  options: ChipSelectorOption[]; // Список опций
  value: string | string[]; // Выбранное значение (строка для single, массив для multiple)
  onValueChange: (value: string | string[]) => void; // Коллбэк изменения
  multiple?: boolean; // Режим множественного выбора
  allowEmpty?: boolean; // Разрешить пустой выбор для single-select режима
  required?: boolean; // Обязательное поле
  helperText?: string; // Подсказка
  helperTextColor?: string; // Цвет подсказки
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  options,
  value,
  onValueChange,
  multiple = false,
  allowEmpty = false,
  required = false,
  helperText,
  helperTextColor,
}) => {
  const { colors, theme } = useThemeStore();

  // Проверяем, выбрана ли опция
  const isSelected = useCallback(
    (optionValue: string) => {
      if (multiple) {
        return Array.isArray(value) && value.includes(optionValue);
      }
      return value === optionValue;
    },
    [value, multiple]
  );

  // Обработчик выбора чипсины
  const handleChipPress = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        if (currentValues.includes(optionValue)) {
          // Убираем из выбранных
          onValueChange(currentValues.filter((v) => v !== optionValue));
        } else {
          // Добавляем к выбранным
          onValueChange([...currentValues, optionValue]);
        }
      } else {
        // Single режим
        if (allowEmpty && value === optionValue) {
          // Если разрешен пустой выбор и нажали на уже выбранную чипсину - деактивируем
          onValueChange("");
        } else {
          // Обычное поведение - выбираем чипсину
          onValueChange(optionValue);
        }
      }
    },
    [value, multiple, allowEmpty, onValueChange]
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      {label && (
        <View style={styles.labelContainer}>
          <Text size="medium" color={colors.contrast}>
            {label}
            {required && <Text color={colors.error}> *</Text>}
          </Text>
        </View>
      )}

      {/* Чипсины */}
      <View style={styles.chipsContainer}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          const chipColor = selected
            ? option.activeColor || colors.accent
            : option.color || theme === "light"
            ? colors.white
            : colors.light;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleChipPress(option.value)}
              activeOpacity={0.7}
            >
              <Chip color={chipColor} title={option.label} size="base" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Подсказка */}
      {helperText && (
        <View style={styles.helperContainer}>
          <Text size="small" color={helperTextColor} style={styles.helperText}>
            {helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChipSelector;
