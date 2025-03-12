import React, { useState, useEffect } from "react";
import { View, Switch } from "react-native";
import { Text, TextField } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { EditFormField } from "../lib/hooks/useEditFormConfig";
import { useT } from "@/src/shared/lib/hooks";

interface FormFieldProps {
  field: EditFormField;
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
          multiline
          required={field.required}
        />
      );

    case "toggle":
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 8,
          }}
        >
          <Text color={colors.contrast}>{field.label}</Text>
          <Switch
            value={value || false}
            onValueChange={handleToggleChange}
            trackColor={{ true: colors.accent }}
            style={{
              borderWidth: 0.5,
              borderColor: colors.alternate,
              borderRadius: 16,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
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

    default:
      return null;
  }
};
