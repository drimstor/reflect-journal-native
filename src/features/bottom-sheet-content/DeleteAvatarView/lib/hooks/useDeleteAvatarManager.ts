import { useProfile } from "@/src/entities/auth/hooks/useProfile";
import { useT } from "@/src/shared/lib/hooks";
import { addSnackbar, useAppDispatch } from "@/src/shared/store";
import { useCallback, useState } from "react";

/**
 * Хук для управления удалением аватара
 * Инкапсулирует логику удаления аватара с обработкой состояний и уведомлений
 */
export const useDeleteAvatarManager = () => {
  const t = useT();
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  // Хук для работы с профилем пользователя
  const { handleDeleteAvatar, isUpdateLoading } = useProfile();

  // Обработчик удаления аватара
  const handleDelete = useCallback(async () => {
    try {
      await handleDeleteAvatar();
      setIsSuccess(true);

      dispatch(
        addSnackbar({
          type: "success",
          text: t("settings.avatarDeleted"),
        })
      );
    } catch (error) {
      console.error("Ошибка удаления аватара:", error);
      dispatch(
        addSnackbar({
          type: "error",
          text: t("settings.avatarDeleteError"),
        })
      );
      throw error;
    }
  }, [handleDeleteAvatar, dispatch, t]);

  return {
    // Методы
    handleDelete,

    // Состояния
    isLoading: isUpdateLoading,
    isSuccess,
  };
};
