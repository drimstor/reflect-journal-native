import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Button, CheckBox, Text, TextField, TrashIcon } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { ChecklistItem } from "@/src/entities/goals/model/types";
import { styles } from "./CheckListEditor.styles";

interface CheckListEditorProps {
  label: string;
  value: ChecklistItem[];
  error?: string;
  onChange: (value: ChecklistItem[]) => void;
}

/**
 * Компонент для редактирования чек-листа
 */
export const CheckListEditor: React.FC<CheckListEditorProps> = ({
  label,
  value,
  error,
  onChange,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const [editMode, setEditMode] = useState(false);

  // Проверяем, что value является массивом
  const checklistItems: ChecklistItem[] = Array.isArray(value) ? value : [];

  // Обработчик добавления нового элемента в чек-лист
  const handleAddItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(), // Генерируем уникальный id на основе текущего времени
      title: "", // Пустое название для нового элемента
      is_completed: false, // По умолчанию задача не выполнена
      completed_at: null, // Время выполнения задачи (null, так как задача не выполнена)
    };

    const updatedItems = [...checklistItems, newItem];
    onChange(updatedItems);
  };

  // Обработчик изменения текста элемента
  const handleItemTextChange = (text: string, itemId: string) => {
    const updatedItems = checklistItems.map((item) =>
      item.id === itemId ? { ...item, title: text } : item
    );
    onChange(updatedItems);
  };

  // Обработчик удаления элемента
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = checklistItems.filter((item) => item.id !== itemId);
    onChange(updatedItems);
  };

  // Обработчик переключения режима редактирования
  const toggleEditMode = () => {
    // Если выходим из режима редактирования
    if (editMode) {
      // Удаляем элементы с пустыми названиями
      const filteredItems = checklistItems.filter(
        (item) => item.title.trim() !== ""
      );
      onChange(filteredItems);
    }

    // Переключаем режим редактирования
    setEditMode(!editMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text color={colors.contrast}>{label}</Text>
        <TouchableOpacity onPress={toggleEditMode}>
          <Text color={colors.contrast} withOpacity={70}>
            {editMode ? t("shared.actions.done") : t("shared.actions.edit")}
          </Text>
        </TouchableOpacity>
      </View>
      {checklistItems.length > 0 ? (
        <FlatList
          data={checklistItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {editMode ? (
                <TextField
                  value={item.title}
                  onChangeText={(text) => handleItemTextChange(text, item.id)}
                  backgroundColor={colors.secondary}
                  helperText={error}
                  helperTextColor={error ? colors.error : undefined}
                />
              ) : (
                <View style={styles.checkboxContainer}>
                  <CheckBox checked={false} onPress={() => {}} />
                  <Text color={colors.contrast}>{item.title}</Text>
                </View>
              )}
              {editMode && (
                <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                  <TrashIcon color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text withOpacity={70} color={colors.contrast} style={styles.emptyText}>
          {t("edit.goals.tasks.empty")}
        </Text>
      )}
      {editMode && (
        <Button
          onPress={handleAddItem}
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          style={styles.addButton}
        >
          <Text color={colors.contrastReverse} size="header">
            +
          </Text>
        </Button>
      )}
      {error && (
        <Text color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CheckListEditor;
