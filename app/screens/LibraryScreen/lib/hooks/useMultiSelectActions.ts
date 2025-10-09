import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import { BookmarkCheckIcon, TrashIcon } from "@/src/shared/ui/icons";

export const useMultiSelectActions = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow, setBottomSheetVisible, setActions } =
    useBottomSheetStore();

  // Обработчик действий мульти-выбора
  const handleMultiSelectActions = () => {
    const actions = [
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

    setActions(actions);
    navigateToFlow("common", "list");

    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  const handleGiftIconPress = () => {
    navigateToFlow("onboarding", "steps");
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  return {
    handleMultiSelectActions,
    handleGiftIconPress,
  };
};
