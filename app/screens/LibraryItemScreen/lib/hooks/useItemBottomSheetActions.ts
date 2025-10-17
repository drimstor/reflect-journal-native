import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import { LinkSquareIcon, TrashIcon } from "@/src/shared/ui/icons";
import { useCallback } from "react";

/**
 * Хук для управления действиями BottomSheet в экране просмотра элемента
 * Обрабатывает открытие BottomSheet для редактирования и управления связями
 */
export const useItemDotsActions = (
  variant: string, // Тип сущности
  item: any, // Текущий элемент
  currentItem: any // Актуальные данные элемента
) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { setActions, navigateToFlow, setFlowData, setBottomSheetVisible } =
    useBottomSheetStore();

  const isJournalEntry = variant === ENTITY_NAME.JOURNAL_ENTRIES;

  // Открытие BottomSheet для управления связями (создание/удаление)
  const handleRelatedEntityDotsPress = useCallback(() => {
    // Устанавливаем действия для связей
    setActions([
      {
        text: t("relatedEntries.create"),
        IconComponent: LinkSquareIcon,
        onPress: () => {
          navigateToFlow("relation", "create");
        },
      },
      {
        text: t("relatedEntries.delete"),
        IconComponent: TrashIcon,
        iconColor: colors.error,
        iconSize: 26,
        onPress: () => {
          navigateToFlow("relation", "delete");
        },
      },
    ]);

    // Для записей дневника используем parent journal
    const sourceType = isJournalEntry ? ENTITY_NAME.JOURNALS : variant;
    const sourceId = isJournalEntry ? item.journal_id : item.id;

    // Устанавливаем данные для flow
    setFlowData({
      variant: sourceType,
      id: sourceId,
      related_entities: currentItem?.related_entities,
    });

    // Открываем BottomSheet
    navigateToFlow("common", "list");
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  }, [
    colors.error,
    currentItem?.related_entities,
    isJournalEntry,
    item.id,
    item.journal_id,
    navigateToFlow,
    setActions,
    setBottomSheetVisible,
    setFlowData,
    t,
    variant,
  ]);

  // Открытие BottomSheet для редактирования записи
  const handleEditPress = useCallback(() => {
    // Устанавливаем данные для редактирования
    setFlowData({
      variant,
      id: currentItem?.id,
      ...currentItem,
    });

    // Открываем flow редактирования
    navigateToFlow("main", "edit");
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  }, [
    currentItem,
    navigateToFlow,
    setBottomSheetVisible,
    setFlowData,
    variant,
  ]);

  return {
    handleRelatedEntityDotsPress,
    handleEditPress,
  };
};
