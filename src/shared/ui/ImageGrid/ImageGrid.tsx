import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useThemeStore } from "../../store";
import { SmallLoader } from "../Loader/SmallLoader";
import { createStyles } from "./ImageGrid.styles";

interface ImageGridProps {
  // Массив URL изображений
  images: string[];
  // Максимальное количество изображений для отображения
  maxVisible?: number;
  // Обработчик нажатия на изображение
  onImagePress?: (imageUrl: string, index: number) => void;
  // Обработчик нажатия на "еще N изображений"
  onMorePress?: (remainingImages: string[]) => void;
  // Размер изображений в сетке
  imageSize?: number;
  // Отступы между изображениями
  spacing?: number;
  // Количество колонок в сетке
  columns?: number;
  // Дополнительные стили для контейнера
  containerStyle?: any;
  // Отключить показ лоадеров (для Portal версии)
  disableImageLoaders?: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  maxVisible = 4,
  onImagePress,
  onMorePress,
  imageSize = 80,
  spacing = 8,
  columns = 2,
  containerStyle,
  disableImageLoaders = false,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  // Состояние загрузки изображений - по умолчанию false
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});

  // Если нет изображений, не рендерим компонент
  if (!images || images.length === 0) {
    return null;
  }

  // Определяем изображения для отображения
  const displayImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;
  const hasMore = remainingCount > 0;

  // Обработчик нажатия на изображение
  const handleImagePress = (imageUrl: string, index: number) => {
    if (onImagePress) {
      onImagePress(imageUrl, index);
    }
  };

  // Обработчик нажатия на "еще N изображений"
  const handleMorePress = () => {
    if (onMorePress && hasMore) {
      const remainingImages = images.slice(maxVisible);
      onMorePress(remainingImages);
    }
  };

  // Обработчики загрузки изображений
  const handleImageLoadStart = (imageUrl: string) => {
    if (!disableImageLoaders) {
      setLoadingImages((prev) => ({ ...prev, [imageUrl]: true }));
    }
  };

  const handleImageLoadEnd = (imageUrl: string) => {
    if (!disableImageLoaders) {
      setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
    }
  };

  // Рендер отдельного изображения
  const renderImage = (
    imageUrl: string,
    index: number,
    isLastAndHasMore: boolean
  ) => {
    return (
      <Pressable
        key={`image_${index}`}
        style={[
          styles.imageContainer,
          {
            width: imageSize,
            height: imageSize,
            marginRight: (index + 1) % columns === 0 ? 0 : spacing,
            marginBottom: spacing,
          },
        ]}
        onPressIn={() => {
          isLastAndHasMore
            ? handleMorePress()
            : handleImagePress(imageUrl, index);
        }}
      >
        {!disableImageLoaders && loadingImages[imageUrl] && (
          <View
            style={[
              styles.loaderContainer,
              { width: imageSize, height: imageSize },
            ]}
          >
            <SmallLoader
              color={colors.contrast}
              size={Math.min(imageSize * 0.4, 40)}
            />
          </View>
        )}
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoadStart={() => handleImageLoadStart(imageUrl)}
          onLoad={() => handleImageLoadEnd(imageUrl)}
          onError={() => handleImageLoadEnd(imageUrl)}
        />

        {/* Оверлей для показа количества оставшихся изображений */}
        {!loadingImages[imageUrl] && isLastAndHasMore && (
          <View style={styles.moreOverlay}>
            <Text style={styles.moreText}>+{remainingCount}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.grid,
          { width: columns * imageSize + (columns - 1) * spacing },
        ]}
      >
        {displayImages.map((imageUrl, index) => {
          const isLastImage = index === displayImages.length - 1;
          const isLastAndHasMore = isLastImage && hasMore;

          return renderImage(imageUrl, index, isLastAndHasMore);
        })}
      </View>
    </View>
  );
};
