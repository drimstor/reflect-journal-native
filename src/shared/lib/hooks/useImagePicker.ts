import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { useT } from ".";
import { addSnackbar, useAppDispatch } from "../../store";

export interface ImagePickerResult {
  uri: string;
  fileName: string;
  fileSize: number;
  type: string;
}

interface UseImagePickerOptions {
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
  quality?: number;
  aspect?: [number, number];
  allowsEditing?: boolean;
  maxFileSize?: number; // в байтах
}

interface UseImagePickerReturn {
  selectedImages: ImagePickerResult[];
  pickFromGallery: () => Promise<void>;
  pickFromCamera: () => Promise<void>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  isLoading: boolean;
}

const DEFAULT_OPTIONS: UseImagePickerOptions = {
  allowsMultipleSelection: true,
  selectionLimit: 5,
  quality: 0.8,
  aspect: [4, 3],
  allowsEditing: false, // Отключаем редактирование по умолчанию для множественного выбора
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

export const useImagePicker = (
  options: UseImagePickerOptions = {}
): UseImagePickerReturn => {
  const [selectedImages, setSelectedImages] = useState<ImagePickerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const config = { ...DEFAULT_OPTIONS, ...options };

  // Запрос разрешений для галереи
  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("shared.media.errors.galleryPermissionTitle"),
        t("shared.media.errors.galleryPermissionMessage"),
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Запрос разрешений для камеры
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("shared.media.errors.cameraPermissionTitle"),
        t("shared.media.errors.cameraPermissionMessage"),
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const dispatch = useAppDispatch();
  const t = useT();

  // Валидация размера файла
  const validateFileSize = (fileSize: number): boolean => {
    if (fileSize > config.maxFileSize!) {
      const maxSizeMB = Math.round(config.maxFileSize! / (1024 * 1024));
      dispatch(
        addSnackbar({
          text: `${t("shared.media.limits.maxFileSize")} ${maxSizeMB} ${t(
            "shared.media.limits.fileUnit"
          )}`,
          type: "success",
        })
      );
      return false;
    }
    return true;
  };

  // Обработка результата выбора изображений
  const processImageResults = (
    result: ImagePicker.ImagePickerResult
  ): ImagePickerResult[] => {
    if (result.canceled || !result.assets) {
      return [];
    }

    const validImages: ImagePickerResult[] = [];

    for (const asset of result.assets) {
      // Проверка размера файла
      if (asset.fileSize && !validateFileSize(asset.fileSize)) {
        continue;
      }

      // Проверка лимита количества изображений
      if (
        selectedImages.length + validImages.length >=
        config.selectionLimit!
      ) {
        dispatch(
          addSnackbar({
            text: `${t("shared.media.limits.maximum")} ${
              config.selectionLimit
            } ${t("shared.media.limits.photos")}`,
            type: "success",
          })
        );
        break;
      }

      validImages.push({
        uri: asset.uri,
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
        fileSize: asset.fileSize || 0,
        type: asset.type || "image/jpeg",
      });
    }

    return validImages;
  };

  // Выбор изображений из галереи
  const pickFromGallery = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: config.allowsEditing,
        aspect: config.aspect,
        quality: config.quality,
        allowsMultipleSelection: config.allowsMultipleSelection,
        selectionLimit: config.selectionLimit,
      });

      const newImages = processImageResults(result);

      if (newImages.length > 0) {
        setSelectedImages((prev) => {
          const updated = [...prev, ...newImages];
          return updated;
        });
      }
    } catch (err) {
      console.error("Ошибка при выборе изображений из галереи:", err);
      dispatch(
        addSnackbar({
          text: t("shared.media.errors.galleryError"),
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Создание фото с камеры
  const pickFromCamera = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: config.allowsEditing,
        aspect: config.aspect,
        quality: config.quality,
      });

      const newImages = processImageResults(result);
      if (newImages.length > 0) {
        // Проверка лимита для камеры
        if (selectedImages.length >= config.selectionLimit!) {
          dispatch(
            addSnackbar({
              text: `${t("shared.media.limits.maximum")} ${
                config.selectionLimit
              } ${t("shared.media.limits.photos")}`,
              type: "error",
            })
          );
          return;
        }
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error("Ошибка при создании фото с камеры:", err);
      dispatch(
        addSnackbar({
          text: t("shared.media.errors.cameraError"),
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление изображения по индексу
  const removeImage = (index: number): void => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Очистка всех изображений
  const clearImages = (): void => {
    setSelectedImages([]);
  };

  return {
    selectedImages,
    pickFromGallery,
    pickFromCamera,
    removeImage,
    clearImages,
    isLoading,
  };
};
