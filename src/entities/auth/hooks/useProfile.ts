import { useCallback } from "react";
import {
  useDeleteAvatarMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "../api/authApi";
import { UpdateProfileRequest } from "../model/types";

interface UseProfileProps {
  // Опциональные параметры для настройки поведения
  refetchOnMount?: boolean;
}

/**
 * Хук для работы с профилем пользователя
 * Предоставляет методы для получения и обновления данных профиля
 */
export const useProfile = (props: UseProfileProps = {}) => {
  const { refetchOnMount = true } = props;

  // Получение данных текущего пользователя
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: refetchOnMount,
  });

  // Мутации для обновления профиля
  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateProfileMutation();
  const [deleteAvatar, { isLoading: isDeleteAvatarLoading }] =
    useDeleteAvatarMutation();

  // Универсальный метод обновления профиля (с аватаром или без)
  const handleUpdateProfile = useCallback(
    async (profileData: UpdateProfileRequest, avatarUri?: string) => {
      try {
        // Если есть аватар, используем FormData
        if (avatarUri) {
          const formData = new FormData();

          // Добавляем обычные поля профиля
          if (profileData.name !== undefined) {
            formData.append("name", profileData.name);
          }
          if (profileData.birth_date !== undefined) {
            formData.append("birth_date", profileData.birth_date.toString());
          }
          if (profileData.gender !== undefined) {
            formData.append("gender", profileData.gender);
          }
          if (profileData.country !== undefined) {
            formData.append("country", profileData.country);
          }
          if (profileData.city !== undefined) {
            formData.append("city", profileData.city);
          }
          if (profileData.occupation !== undefined) {
            formData.append("occupation", profileData.occupation);
          }
          if (profileData.workplace_or_study !== undefined) {
            formData.append(
              "workplace_or_study",
              profileData.workplace_or_study
            );
          }

          // Добавляем аватар
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
        } else {
          // Если аватара нет, отправляем обычный JSON
          const result = await updateProfile(profileData).unwrap();
          return result;
        }
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
    handleDeleteAvatar,
    isUpdateLoading: isUpdateLoading || isDeleteAvatarLoading,
  };
};
