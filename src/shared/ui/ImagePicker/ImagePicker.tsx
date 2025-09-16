import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ImagePicker.styles";

interface ImagePickerProps {
  onPickFromGallery: () => void;
  onPickFromCamera: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  showGalleryOption?: boolean;
  showCameraOption?: boolean;
  buttonStyle?: any;
  iconSize?: number;
  iconColor?: string;
  galleryLabel?: string;
  cameraLabel?: string;
  title?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onPickFromGallery,
  onPickFromCamera,
  isLoading = false,
  disabled = false,
  showGalleryOption = true,
  showCameraOption = true,
  buttonStyle,
  iconSize = 24,
  iconColor = "#007AFF",
  galleryLabel = "Галерея",
  cameraLabel = "Камера",
  title = "Выберите источник",
}) => {
  // Показ опций выбора изображения
  const showImageSourceOptions = () => {
    if (disabled || isLoading) {
      return;
    }

    const options: Array<{ text: string; onPress: () => void }> = [];

    if (showGalleryOption) {
      options.push({
        text: galleryLabel,
        onPress: onPickFromGallery,
      });
    }

    if (showCameraOption) {
      options.push({
        text: cameraLabel,
        onPress: onPickFromCamera,
      });
    }

    options.push({
      text: "Отмена",
      onPress: () => {},
    });

    Alert.alert(title, "", options);
  };

  // Если показывается только один вариант, вызываем его напрямую
  const handlePress = () => {
    if (disabled || isLoading) {
      return;
    }

    const availableOptions = [
      showGalleryOption && onPickFromGallery,
      showCameraOption && onPickFromCamera,
    ].filter(Boolean);

    if (availableOptions.length === 1) {
      // Если доступна только одна опция, вызываем её напрямую
      if (showGalleryOption) {
        onPickFromGallery();
      } else {
        onPickFromCamera();
      }
    } else {
      // Показываем выбор опций
      showImageSourceOptions();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        (disabled || isLoading) && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name={isLoading ? "hourglass-outline" : "image-outline"}
          size={iconSize}
          color={disabled || isLoading ? "#CCCCCC" : iconColor}
        />
        <Text
          style={[
            styles.buttonText,
            { color: disabled || isLoading ? "#CCCCCC" : iconColor },
          ]}
        >
          {isLoading ? "Загрузка..." : "Добавить фото"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
