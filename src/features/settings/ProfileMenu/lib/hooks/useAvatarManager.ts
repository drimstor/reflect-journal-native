import { useProfile } from "@/src/entities/auth/hooks/useProfile";
import {
  useImagePickerWithActions,
  useLang,
  useT,
} from "@/src/shared/lib/hooks";
import {
  addSnackbar,
  useAppDispatch,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import { TrashIcon } from "@/src/shared/ui/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseAvatarManagerProps {
  // Опциональные настройки для image picker
  quality?: number;
  allowsEditing?: boolean;
}

/**
 * Хук для управления аватаром пользователя
 * Инкапсулирует всю логику загрузки, обновления и удаления аватара
 */
export const useAvatarManager = ({
  quality = 0.8,
  allowsEditing = true,
}: UseAvatarManagerProps) => {
  const t = useT();
  const { locale } = useLang();
  const dispatch = useAppDispatch();
  const { colors } = useThemeStore();
  const { navigateToFlow } = useBottomSheetStore();

  // Хук для работы с профилем пользователя
  const { userData, isUserLoading, handleUpdateAvatar, isUpdateLoading } =
    useProfile();

  // Локальное состояние для аватара и загрузки
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatar_url);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isProcessingRef = useRef(false);

  // Синхронизация с данными пользователя
  useEffect(() => {
    setAvatarUrl(userData?.avatar_url);
  }, [userData?.avatar_url]);

  // Обработчик навигации к экрану подтверждения удаления аватара
  const handleNavigateToDeleteAvatar = useCallback(() => {
    navigateToFlow("profile", "deleteAvatar");
  }, [navigateToFlow]);

  // Дополнительные действия для меню выбора изображения
  const additionalActions = useMemo(() => {
    if (!avatarUrl) return [];

    return [
      {
        text: t("settings.deleteAvatar"),
        IconComponent: TrashIcon,
        onPress: handleNavigateToDeleteAvatar,
        iconColor: colors.error,
      },
    ];
  }, [avatarUrl, t, handleNavigateToDeleteAvatar, locale]);

  // Хук для работы с изображениями и обработкой выбора
  const {
    selectedImages,
    clearImages,
    isLoading: isImagePickerLoading,
    handleImagePicker,
  } = useImagePickerWithActions({
    allowsMultipleSelection: false, // Только одно изображение для аватара
    selectionLimit: 1,
    quality,
    allowsEditing,
    additionalActions, // Передаем дополнительные действия
  });

  // Общий флаг загрузки
  const isLoading =
    isUpdateLoading || isImagePickerLoading || isUserLoading || isImageLoading;

  // Автоматически загружаем аватар при выборе изображения
  useEffect(() => {
    const handleAvatarUpload = async () => {
      if (selectedImages.length === 0 || isProcessingRef.current) return;

      // Устанавливаем флаг обработки
      isProcessingRef.current = true;

      try {
        const avatarUri = selectedImages[0].uri;
        const response = await handleUpdateAvatar(avatarUri);

        if (response.avatar_url) {
          setAvatarUrl(response.avatar_url);
        }

        // Очищаем выбранные изображения после успешной загрузки
        clearImages();

        dispatch(
          addSnackbar({
            type: "success",
            text: t("settings.avatarUpdated"),
          })
        );
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        dispatch(
          addSnackbar({
            type: "error",
            text: t("settings.avatarUploadError"),
          })
        );
      } finally {
        // Сбрасываем флаг после завершения
        isProcessingRef.current = false;
      }
    };

    if (selectedImages.length > 0) {
      handleAvatarUpload();
    }
  }, [selectedImages, handleUpdateAvatar, clearImages, dispatch, t]);

  return {
    // Данные
    avatarUrl,
    userData,
    isUserLoading,

    // Состояния загрузки
    isLoading,
    isImageLoading,

    // Методы
    handleImagePicker,
    setIsImageLoading,

    // Дополнительные данные
    hasAvatar: Boolean(avatarUrl),
  };
};
