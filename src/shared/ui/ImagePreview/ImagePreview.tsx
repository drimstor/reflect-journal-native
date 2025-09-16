import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useT } from "../../lib/hooks";
import { ImagePickerResult } from "../../lib/hooks/useImagePicker";
import { useThemeStore } from "../../store";
import { PlusIcon } from "../icons";
import { SmallLoader } from "../Loader/SmallLoader";
import { createStyles } from "./ImagePreview.styles";

interface ImagePreviewProps {
  images: ImagePickerResult[];
  onRemove?: (index: number) => void;
  onImagePress?: (image: ImagePickerResult, index: number) => void;
  maxDisplayCount?: number;
  showRemoveButton?: boolean;
  containerStyle?: any;
  onMorePress?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  onImagePress,
  maxDisplayCount = 5,
  showRemoveButton = true,
  containerStyle,
  onMorePress,
}) => {
  const { colors } = useThemeStore();
  const t = useT();
  // Состояние загрузки изображений
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});

  const styles = createStyles(colors);

  // Ограничиваем количество отображаемых изображений
  const displayImages = images.slice(0, maxDisplayCount);
  const hasMoreImages = images.length < maxDisplayCount;

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return `0 ${t("shared.media.fileSizes.bytes")}`;
    const k = 1024;
    const sizes = [
      t("shared.media.fileSizes.bytes"),
      t("shared.media.fileSizes.kilobytes"),
      t("shared.media.fileSizes.megabytes"),
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Обработка нажатия на изображение
  const handleImagePress = (image: ImagePickerResult, index: number) => {
    if (onImagePress) {
      onImagePress(image, index);
    }
  };

  // Обработка удаления изображения
  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  // Обработчики загрузки изображений
  const handleImageLoadStart = (imageUri: string) => {
    setLoadingImages((prev) => ({ ...prev, [imageUri]: true }));
  };

  const handleImageLoadEnd = (imageUri: string) => {
    setLoadingImages((prev) => ({ ...prev, [imageUri]: false }));
  };

  return (
    <View style={[containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayImages.map((image, index) => (
          <TouchableOpacity
            key={`${image.uri}_${index}`}
            style={styles.imageWrapper}
            onPress={() => handleImagePress(image, index)}
            activeOpacity={0.8}
          >
            {loadingImages[image.uri] && (
              <View style={styles.loaderContainer}>
                <SmallLoader size={30} />
              </View>
            )}
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => handleImageLoadStart(image.uri)}
              onLoadEnd={() => handleImageLoadEnd(image.uri)}
              onError={() => handleImageLoadEnd(image.uri)}
            />

            {/* Информация о файле */}
            <View style={styles.imageInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {image.fileName}
              </Text>
              {image.fileSize > 0 && (
                <Text style={styles.fileSize}>
                  {formatFileSize(image.fileSize)}
                </Text>
              )}
            </View>

            {/* Кнопка удаления */}
            {!loadingImages[image.uri] && showRemoveButton && onRemove && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(index)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <PlusIcon color={colors.white} size={20} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {/* Индикатор дополнительных изображений */}
        {hasMoreImages && (
          <TouchableOpacity
            style={styles.moreImagesContainer}
            onPress={() => onMorePress?.()}
          >
            <Text style={styles.moreImagesPlus}>
              <PlusIcon color={colors.white} size={22} />
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
