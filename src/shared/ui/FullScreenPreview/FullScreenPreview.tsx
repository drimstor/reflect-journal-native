import { Image } from "expo-image";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton, PlusIcon } from "..";
import { useDeviceStore, useThemeStore } from "../../store";
import { ImageGrid } from "../ImageGrid/ImageGrid";
import { Loader } from "../Loader/Loader";
import Carousel from "../Slider/Carousel";
import { styles } from "./FullScreenPreview.styles";

interface FullScreenPreviewProps {
  // Все пропсы от ImageGrid
  images: string[];
  maxVisible?: number;
  imageSize?: number;
  spacing?: number;
  columns?: number;
  containerStyle?: any;
  // Отключить показ лоадеров (для Portal версии)
  disableImageLoaders?: boolean;
}

export const FullScreenPreview: React.FC<FullScreenPreviewProps> = ({
  images,
  maxVisible = 4,
  imageSize = 80,
  spacing = 8,
  columns = 2,
  containerStyle,
  disableImageLoaders = false,
}) => {
  const { colors, theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { window, statusBarHeight } = useDeviceStore();
  // Состояние для модального окна
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Индекс текущего изображения
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Состояние загрузки изображений
  const [loadingImages, setLoadingImages] = useState<{
    [key: number]: boolean;
  }>({});

  // Обработчик нажатия на изображение
  const handleImagePress = (imageUrl: string, index: number) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  // Обработчик нажатия на "еще N изображений"
  const handleMorePress = (remainingImages: string[]) => {
    // Открываем первое изображение из оставшихся (maxVisible + 1)
    setCurrentImageIndex(maxVisible);
    setIsModalVisible(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Обработчик изменения текущего индекса в карусели
  const handleCarouselIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Обработчики загрузки изображений
  const handleImageLoadStart = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoadEnd = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }));
  };

  // Создаем данные для карусели
  const carouselData = images.map((url, index) => ({
    title: `Image ${index + 1}`,
    subTitle: "",
    icon: null,
    imageUrl: url, // Добавляем дополнительное поле для URL изображения
  }));

  // Рендер элемента карусели
  const renderCarouselItem = ({ item }: { item: any }) => {
    // Получаем индекс из данных карусели
    const index = carouselData.findIndex(
      (carouselItem) => carouselItem.imageUrl === item.imageUrl
    );

    return (
      <View style={styles.carouselItemContainer}>
        {loadingImages[index] && (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        )}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.fullScreenImage}
          contentFit="contain"
          cachePolicy="memory-disk"
          onLoadStart={() => handleImageLoadStart(index)}
          onLoad={() => handleImageLoadEnd(index)}
          onError={() => handleImageLoadEnd(index)}
        />
      </View>
    );
  };

  // Рендер полноэкранного слайдера
  const renderFullScreenSlider = () => {
    return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={[
            styles.modalContainer,
            { paddingTop: insets.top + statusBarHeight },
          ]}
        >
          {/* Основной контент */}
          <View style={styles.contentContainer}>
            {/* Карусель с изображениями */}
            <View style={styles.carouselWrapper}>
              <Carousel
                height={window.height - 140}
                data={carouselData}
                renderItem={renderCarouselItem}
                handler={handleCarouselIndexChange}
                defaultIndex={currentImageIndex}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 40,
                }}
                style={styles.carousel}
                dotColors={{
                  dot: theme === "dark" ? colors.alternate : "#6b6b6b",
                  activeDot:
                    theme === "dark" ? colors.contrast : colors.alternate,
                }}
              />
            </View>

            {/* Кнопка закрытия */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <IconButton isAnimated onPress={closeModal}>
                <PlusIcon size={28} color={colors.contrast} />
              </IconButton>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <ImageGrid
        images={images}
        maxVisible={maxVisible}
        onImagePress={handleImagePress}
        onMorePress={handleMorePress}
        imageSize={imageSize}
        spacing={spacing}
        columns={columns}
        containerStyle={containerStyle}
        disableImageLoaders={disableImageLoaders}
      />
      {renderFullScreenSlider()}
    </>
  );
};
