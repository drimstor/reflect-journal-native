import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore } from "@/src/shared/store";
import { CameraIcon, ImageIcon } from "@/src/shared/ui/icons";
import { ImagePickerOptions } from "expo-image-picker";
import { useImagePicker } from "./useImagePicker";

interface UseImagePickerWithActionsConfig extends ImagePickerOptions {
  // Кастомные функции открытия/закрытия BottomSheet (опциональные)
  onOpenBottomSheet?: () => void;
  onCloseBottomSheet?: () => void;
}

/**
 * Универсальный хук для работы с изображениями и обработкой выбора через BottomSheet
 * Объединяет useImagePicker и логику обработки действий
 */
export const useImagePickerWithActions = (
  config: UseImagePickerWithActionsConfig
) => {
  const t = useT();
  const { navigateToFlow, setActions, resetFlow, setBottomSheetVisible } =
    useBottomSheetStore();

  // Используем базовый хук для работы с изображениями
  const imagePickerResult = useImagePicker(config);
  const { pickFromGallery, pickFromCamera } = imagePickerResult;

  // Дефолтные функции для работы с BottomSheet
  const defaultOpenBottomSheet = () => {
    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 150);
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
    // Если используются кастомные функции, добавляем resetFlow с задержкой
    if (config.onCloseBottomSheet) {
      setTimeout(resetFlow, 500);
    }
  };

  // Основной обработчик выбора изображений
  const handleImagePicker = () => {
    const actions = [
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

    setActions(actions);
    navigateToFlow("common", "list");
    openBottomSheet();
  };

  return {
    ...imagePickerResult,
    handleImagePicker,
  };
};
