import { useBulkUpdateChecklistItemsMutation } from "@/src/entities/goals/api/goalsApi";
import { ChecklistItem } from "@/src/entities/goals/model/types";
import useDebounce from "@/src/shared/lib/hooks/useDebounce";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";

/**
 * Хук для управления чеклистами с дебаунсированным обновлением на сервере.
 * Обеспечивает мгновенное обновление UI и отправку изменений на сервер после периода бездействия.
 */

export const useChecklistActions = (
  variant: string, // Тип сущности (Goals, Journals, etc.)
  itemId: string, // ID сущности
  initialChecklist: ChecklistItem[] = [] // Начальный список чекбоксов
): {
  checkboxes: ChecklistItem[];
  isUpdatingChecklistItem: boolean;
  handleCheckboxToggle: (id: string) => void;
} => {
  //Объект с чекбоксами, статусом загрузки и обработчиком переключения
  // Используем начальные данные для чекбоксов
  const [checkboxes, setCheckboxes] = useState<ChecklistItem[]>(
    initialChecklist || []
  );

  // Инициализируем мутацию для массового обновления элементов чеклиста
  const [bulkUpdateItems, { isLoading: isUpdatingChecklistItem }] =
    useBulkUpdateChecklistItemsMutation();

  // Применяем дебаунс к локальному состоянию чекбоксов
  const debouncedCheckboxes = useDebounce(checkboxes, 1000);

  useEffect(() => {
    setCheckboxes(initialChecklist);
  }, [itemId]);

  // Обновляем чекбоксы при изменении initialChecklist (в том числе когда становится пустым)
  useEffect(() => {
    setCheckboxes(initialChecklist || []);
  }, [initialChecklist]);

  // Эффект для отправки изменений на сервер после дебаунса
  useEffect(() => {
    // Если не Goals или нет начальных данных, не отправляем запрос
    if (variant !== "Goals" || !(initialChecklist?.length || 0)) return;

    // Находим измененные элементы
    const changedItems = checkboxes.filter((item) => {
      const original = initialChecklist.find((orig) => orig.id === item.id);
      return original && original.is_completed !== item.is_completed;
    });

    if (changedItems.length === 0) return;

    const updateItems = async () => {
      try {
        // Отправляем все изменения одним запросом
        await bulkUpdateItems({
          goalId: itemId,
          body: {
            items: changedItems.map((item) => ({
              id: item.id,
              is_completed: item.is_completed,
            })),
          },
        }).unwrap();
      } catch (error) {
        console.error("Failed to update checklist items:", error);

        // В случае ошибки возвращаем предыдущее состояние
        setCheckboxes(initialChecklist);
      }
    };

    updateItems();
  }, [debouncedCheckboxes, initialChecklist, itemId, variant, bulkUpdateItems]);

  /**
   * Обработчик переключения чекбокса
   * @param {string} id - ID элемента чеклиста
   */
  const handleCheckboxToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    // Находим текущий элемент чеклиста
    const checklistItem = checkboxes.find((item) => item.id === id);

    if (!checklistItem) return;

    // Обновляем локальное состояние для мгновенной обратной связи
    setCheckboxes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_completed: !item.is_completed } : item
      )
    );
  };

  return {
    checkboxes,
    isUpdatingChecklistItem,
    handleCheckboxToggle,
  };
};
