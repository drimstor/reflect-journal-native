import { useCallback } from "react";
import {
  useDeleteAvatarMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "../api/authApi";

/**
 * Хук для работы с профилем пользователя
 * Предоставляет методы для получения и обновления данных профиля
 */
export const useProfile = () => {
  // Получение данных текущего пользователя
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery();

  // Мутации для обновления профиля
  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateProfileMutation();
  const [deleteAvatar, { isLoading: isDeleteAvatarLoading }] =
    useDeleteAvatarMutation();

  // Метод обновления профиля с FormData (для формы)
  const handleUpdateProfile = useCallback(
    async (profileData: FormData) => {
      try {
        const result = await updateProfile(profileData).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateProfile]
  );

  // Метод обновления только аватара
  const handleUpdateAvatar = useCallback(
    async (avatarUri: string) => {
      try {
        const formData = new FormData();

        // Добавляем только аватар
        const filename = avatarUri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("avatar", {
          uri: avatarUri,
          type,
          name: filename,
        } as any);

        const result = await updateProfile(formData).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateProfile]
  );

  // Метод удаления аватара
  const handleDeleteAvatar = useCallback(async () => {
    try {
      const result = await deleteAvatar().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [deleteAvatar]);

  return {
    // Данные пользователя
    userData,
    isUserLoading,
    userError,
    refetchUser,

    // Методы обновления
    handleUpdateProfile,
    handleUpdateAvatar,
    handleDeleteAvatar,
    isUpdateLoading: isUpdateLoading || isDeleteAvatarLoading,
  };
};
