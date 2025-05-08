import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { LibraryListVariant } from "@/src/shared/model/types";
import {
  BookmarkCheckIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import { useFiltersStore, useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";

/**
 * Хук для управления действиями с элементами списка
 * @param variant Тип сущности (Journals, Chats, Goals, Summaries, JournalEntries)
 * @param flowData Элемент, с которым будут выполняться действия
 */
export const useBottomSheetActions = <T extends { id: string }>(
  variant: LibraryListVariant,
  flowData?: T
) => {
  const { setBottomSheetVisible, navigateToFlow, setFlowData, setActions } =
    useBottomSheetStore();

  const t = useT();
  const { colors } = useThemeStore();
  const { multi_select_ids } = useFiltersStore();

  /**
   * Обработчик нажатия на кнопку с тремя точками (опции)
   */
  const handlePress = () => {
    const defaultActions = [
      {
        text: t("shared.actions.edit"),
        IconComponent: EditPencilIcon,
        onPress: () => {
          navigateToFlow("main", "edit");
        },
      },
      {
        text: t("shared.actions.delete"),
        IconComponent: TrashIcon,
        iconColor: colors.error,
        iconSize: 26,
        onPress: () => {
          navigateToFlow("main", "delete");
        },
      },
    ];

    const multiSelectActions = [
      {
        text: t("edit.common.bookmarked.label"),
        IconComponent: BookmarkCheckIcon,
        onPress: () => {
          navigateToFlow("multiSelect", "bookmarked");
        },
      },
      {
        text: t("shared.actions.delete"),
        IconComponent: TrashIcon,
        iconColor: colors.error,
        iconSize: 26,
        onPress: () => {
          navigateToFlow("multiSelect", "delete");
        },
      },
    ];

    setActions(multi_select_ids?.length ? multiSelectActions : defaultActions);
    // Настройка данных потока
    navigateToFlow("common", "list");

    if (flowData) setFlowData({ variant, ...flowData });

    // Отображение BottomSheet с небольшой задержкой
    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 150);
  };

  return {
    handlePress,
  };
};
