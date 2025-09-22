import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore } from "@/src/shared/store";
import { CameraIcon, ImageIcon } from "@/src/shared/ui/icons";
import { ImagePickerOptions } from "expo-image-picker";
import { FC } from "react";
import { IconProps } from "../../model/types";
import { useImagePicker } from "./useImagePicker";

interface ActionItem {
  text: string;
  IconComponent?: FC<IconProps>;
  onPress: () => void;
}

interface UseImagePickerWithActionsConfig extends ImagePickerOptions {
  // Кастомные функции открытия/закрытия BottomSheet (опциональные)
  onOpenBottomSheet?: () => void;
  onCloseBottomSheet?: () => void;
  // Дополнительные действия для добавления в меню
  additionalActions?: ActionItem[];
}

/**
 * Универсальный хук для работы с изображениями и обработкой выбора через BottomSheet
 * Объединяет useImagePicker и логику обработки действий
 */
export const useImagePickerWithActions = (
  config: UseImagePickerWithActionsConfig
) => {
  const t = useT();
  const { navigateToFlow, setActions, setBottomSheetVisible } =
    useBottomSheetStore();

  // Используем базовый хук для работы с изображениями
  const imagePickerResult = useImagePicker(config);
  const { pickFromGallery, pickFromCamera } = imagePickerResult;

  // Дефолтные функции для работы с BottomSheet
  const defaultOpenBottomSheet = () => {
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  const defaultCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  // Используем кастомные функции или дефолтные
  const openBottomSheet = config.onOpenBottomSheet || defaultOpenBottomSheet;
  const closeBottomSheet = config.onCloseBottomSheet || defaultCloseBottomSheet;

  // Обработчик действий с закрытием BottomSheet
  const handleActionWithBottomSheetClose = (func: () => void) => {
    func();
    closeBottomSheet();
  };

  // Основной обработчик выбора изображений
  const handleImagePicker = () => {
    const defaultActions = [
      {
        text: t("shared.media.pickFromGallery"),
        IconComponent: ImageIcon,
        onPress: () => handleActionWithBottomSheetClose(pickFromGallery),
      },
      {
        text: t("shared.media.openCamera"),
        IconComponent: CameraIcon,
        onPress: () => handleActionWithBottomSheetClose(pickFromCamera),
      },
    ];

    // Добавляем дополнительные действия если они переданы
    const allActions = config.additionalActions
      ? [
          ...defaultActions,
          ...config.additionalActions.map((action) => ({
            ...action,
            onPress: () => handleActionWithBottomSheetClose(action.onPress),
          })),
        ]
      : defaultActions;

    setActions(allActions);
    navigateToFlow("common", "list");
    openBottomSheet();
  };

  return {
    ...imagePickerResult,
    handleImagePicker,
  };
};
