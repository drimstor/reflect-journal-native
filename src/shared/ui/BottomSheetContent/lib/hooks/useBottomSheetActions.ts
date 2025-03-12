import { useNavigation } from "@react-navigation/native";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { LibraryListVariant } from "@/src/shared/model/types";
import { EditPencilIcon, TrashIcon } from "@/src/shared/ui/icons";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useCallback } from "react";
import { BottomSheetAction } from "@/src/shared/ui";
/**
 * Хук для управления действиями с элементами списка
 * @param variant Тип сущности (Journals, Chats, Goals, Summaries, JournalEntries)
 * @param item Элемент, с которым будут выполняться действия
 */
export const useBottomSheetActions = <T extends { id: string }>(
  variant: LibraryListVariant,
  item: T,
  customActions?: BottomSheetAction[]
) => {
  const { setBottomSheetVisible, navigateToFlow, setFlowData, setActions } =
    useBottomSheetStore();
  const { colors } = useThemeStore();
  const t = useT();

  /**
   * Обработчик нажатия на кнопку с тремя точками (опции)
   */
  const handlePress = useCallback(() => {
    // Настройка действий для BottomSheet
    const actions = [
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

    setActions(customActions || actions);

    // Настройка данных потока
    navigateToFlow("main", "actionsList");

    setFlowData({
      variant,
      ...item,
    });

    // Отображение BottomSheet с небольшой задержкой
    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 150);
  }, [
    item,
    variant,
    colors,
    navigateToFlow,
    setFlowData,
    setBottomSheetVisible,
    t,
  ]);

  return {
    handlePress,
  };
};
