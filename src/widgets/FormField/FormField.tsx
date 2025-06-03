import React, { useState, useEffect } from "react";
import { View, Switch } from "react-native";
import { MoodSelector, Text, TextField } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { CheckListEditor } from "@/src/features";
import { styles } from "./FormField.styles";

export interface FormField {
  key: string; // Ключ поля в объекте данных
  type:
    | "text"
    | "textarea"
    | "toggle"
    | "tags"
    | "entities"
    | "mood"
    | "check-list";
  label: string; // Заголовок поля
  placeholder?: string; // Подсказка для поля
  required?: boolean; // Является ли поле обязательным
  superMultiline?: boolean; // Является ли поле многострочным
}

interface FormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (key: string, value: any) => void;
}

/**
 * Компонент для отображения поля формы в зависимости от его типа
 */
export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  // Форматируем значение если оно массив
  const formattedValue = Array.isArray(value) ? value.join(", ") : value;

  // Состояние для тегов
  const [tagsInput, setTagsInput] = useState(formattedValue);

  // Обновляем локальное состояние при изменении value извне
  useEffect(() => {
    if (field.type === "tags" && Array.isArray(value)) {
      setTagsInput(formattedValue);
    }
  }, [field.type, value]);

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

  switch (field.type) {
    case "text":
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          value={value || ""}
          onChangeText={handleTextChange}
          backgroundColor={colors.secondary}
          helperText={error}
          helperTextColor={error ? colors.error : undefined}
          required={field.required}
        />
      );

    case "textarea":
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          value={value || ""}
          onChangeText={handleTextChange}
          backgroundColor={colors.secondary}
          helperText={error}
          helperTextColor={error ? colors.error : undefined}
          multiline={!field.superMultiline}
          required={field.required}
          superMultiline={field.superMultiline}
        />
      );

    case "toggle":
      return (
        <View style={styles.toggleContainer}>
          <Text color={colors.contrast}>{field.label}</Text>
          <Switch
            value={value || false}
            onValueChange={handleToggleChange}
            trackColor={{ true: colors.accent }}
            style={{
              ...styles.toggle,
              borderColor: colors.alternate,
            }}
          />
        </View>
      );

    case "tags":
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          value={tagsInput}
          onChangeText={handleTagsInputChange}
          backgroundColor={colors.secondary}
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

    default:
      return null;
  }
};
