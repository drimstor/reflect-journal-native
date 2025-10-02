import { CheckListEditor } from "@/src/features";
import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import type { ChipSelectorOption, MonthYearValue } from "@/src/shared/ui";
import {
  ChipSelector,
  Info,
  MonthYearPicker,
  MoodSelector,
  Select,
  Text,
  TextField,
  Toggle,
} from "@/src/shared/ui";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./FormField.styles";

export interface FormFieldConfig {
  key: string; // Ключ поля в объекте данных
  type:
    | "text"
    | "textarea"
    | "toggle"
    | "tags"
    | "entities"
    | "mood"
    | "check-list"
    | "select"
    | "month-year-picker"
    | "chip-selector";
  label: string; // Заголовок поля
  placeholder?: string; // Подсказка для поля
  required?: boolean; // Является ли поле обязательным
  superMultiline?: boolean; // Является ли поле многострочным
  tooltipText?: string; // Подсказка для поля
  secureTextEntry?: boolean; // Скрыть текст (для паролей)
  options?: { label: string; value: string }[]; // Опции для select
  // Настройки для month-year-picker
  showDay?: boolean; // Показывать селектор дня
  showMonth?: boolean; // Показывать селектор месяца
  showYear?: boolean; // Показывать селектор года
  minYear?: number; // Минимальный год
  maxYear?: number; // Максимальный год
  monthYearPlaceholders?: {
    day?: string;
    month?: string;
    year?: string;
  }; // Плейсхолдеры для month-year-picker
  backgroundColor?: string; // Цвет фона
  // Настройки для chip-selector
  chipOptions?: ChipSelectorOption[]; // Опции для chip-selector
  multiple?: boolean; // Множественный выбор для chip-selector
  allowEmpty?: boolean; // Разрешить пустой выбор для single-select chip-selector
}

interface FormFieldProps {
  field: FormFieldConfig;
  value: any;
  error?: string;
  onChange: (key: string, value: any) => void;
}

/**
 * Функция сравнения для React.memo
 */
const arePropsEqual = (
  prevProps: FormFieldProps,
  nextProps: FormFieldProps
) => {
  return (
    prevProps.field.key === nextProps.field.key &&
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field)
  );
};

/**
 * Компонент для отображения поля формы в зависимости от его типа
 */
export const FormField: React.FC<FormFieldProps> = React.memo(
  ({ field, value, error, onChange }) => {
    const t = useT();
    const { colors } = useThemeStore();

    // Форматируем значение если оно массив
    const formattedValue = Array.isArray(value) ? value.join(", ") : value;

    // Состояние для тегов
    const [tagsInput, setTagsInput] = useState(formattedValue);

    // Обновляем локальное состояние при изменении value извне
    useEffect(() => {
      if (field.type === "tags" && Array.isArray(value)) {
        setTagsInput(formattedValue);
      }
    }, [field.type, value, formattedValue]);

    // Обработчик изменения текстового поля
    const handleTextChange = (text: string) => {
      onChange(field.key, text);
    };

    // Обработчик изменения переключателя
    const handleToggleChange = (value: boolean) => {
      onChange(field.key, value);
    };

    // Обработчик изменения тегов
    const handleTagsChange = (tags: string[]) => {
      onChange(field.key, tags);
    };

    // Обработчик изменения текста в поле тегов
    const handleTagsInputChange = (text: string) => {
      setTagsInput(text);

      const lastChar = text[text.length - 1];

      if (lastChar !== "," && lastChar !== " ") {
        const tags = text
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        handleTagsChange(tags);
      }
    };

    // Обработчик изменения настроения
    const handleMoodChange = (moodValue: string) => {
      onChange(field.key, moodValue);
    };

    // Обработчик изменения даты в MonthYearPicker
    const handleMonthYearChange = (dateValue: MonthYearValue) => {
      onChange(field.key, dateValue);
    };

    // Обработчик изменения chip-selector
    const handleChipSelectorChange = (chipValue: string | string[]) => {
      onChange(field.key, chipValue);
    };

    const backgroundColor = field.backgroundColor || colors.light;

    switch (field.type) {
      case "text":
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ""}
            onChangeText={handleTextChange}
            backgroundColor={backgroundColor}
            helperText={error}
            helperTextColor={error ? colors.error : undefined}
            required={field.required}
            secureTextEntry={field.secureTextEntry}
          />
        );

      case "textarea":
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={value || ""}
            onChangeText={handleTextChange}
            backgroundColor={backgroundColor}
            helperText={error}
            helperTextColor={error ? colors.error : undefined}
            multiline={!field.superMultiline}
            required={field.required}
            superMultiline={field.superMultiline}
          />
        );

      case "toggle":
        return (
          <Toggle
            label={
              field.tooltipText ? (
                <Info tooltipText={field.tooltipText}>{field.label}</Info>
              ) : (
                field.label
              )
            }
            value={value || false}
            onValueChange={handleToggleChange}
            style={{ container: { marginVertical: 4 } }}
          />
        );

      case "tags":
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            value={tagsInput}
            onChangeText={handleTagsInputChange}
            backgroundColor={backgroundColor}
            helperText={error || t("edit.common.tags.helperText")}
            helperTextColor={error ? colors.error : undefined}
          />
        );

      case "mood":
        return (
          <View style={styles.moodContainer}>
            <Text color={colors.contrast} style={styles.moodLabel}>
              {field.label}
            </Text>
            <MoodSelector
              value={value || "neutral"}
              onChange={handleMoodChange}
              colors={colors}
            />
          </View>
        );

      case "check-list":
        return (
          <CheckListEditor
            label={field.label}
            value={value}
            error={error}
            onChange={(updatedItems) => onChange(field.key, updatedItems)}
          />
        );

      case "select":
        return (
          <Select
            label={field.label}
            placeholder={field.placeholder}
            value={value || ""}
            onValueChange={(selectedValue) =>
              onChange(field.key, selectedValue)
            }
            backgroundColor={backgroundColor}
            helperText={error}
            helperTextColor={error ? colors.error : undefined}
            required={field.required}
            options={field.options || []}
          />
        );

      case "month-year-picker":
        return (
          <MonthYearPicker
            label={field.label}
            value={value || {}}
            onValueChange={handleMonthYearChange}
            backgroundColor={backgroundColor}
            helperText={error}
            helperTextColor={error ? colors.error : undefined}
            required={field.required}
            showDay={field.showDay}
            showMonth={field.showMonth}
            showYear={field.showYear}
            minYear={field.minYear}
            maxYear={field.maxYear}
            placeholders={field.monthYearPlaceholders}
          />
        );

      case "chip-selector":
        return (
          <ChipSelector
            label={field.label}
            options={field.chipOptions || []}
            value={value || (field.multiple ? [] : "")}
            onValueChange={handleChipSelectorChange}
            multiple={field.multiple}
            required={field.required}
            helperText={error}
            helperTextColor={error ? colors.error : undefined}
            allowEmpty={field.allowEmpty}
          />
        );

      default:
        return null;
    }
  },
  arePropsEqual
);
