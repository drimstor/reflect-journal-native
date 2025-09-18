import { TypedPreviewBlock } from "@/src/features";
import { ThemeColors } from "@/src/shared/model/types";
import { Carousel, DotsIcon, PaddingLayout, TitleText } from "@/src/shared/ui";
import React from "react";
import { View } from "react-native";
import { itemCarouselStyles } from "./ItemCarousel.styles";

// Тип элемента для карусели
type CarouselItemType = {
  [key: string]: any;
  name: string;
};

interface ItemCarouselProps {
  title: string; // Заголовок карусели
  data: CarouselItemType[] | undefined; // Данные для карусели
  onSelectItem?: (index: number) => void; // Обработчик выбора элемента
  modeConfig: {
    parallaxScrollingScale: number;
    parallaxScrollingOffset: number;
    parallaxAdjacentItemScale: number;
  }; // Конфигурация режима карусели
  colors: ThemeColors; // Цвета темы
  style?: any; // Опциональный стиль для контейнера
  willCreate?: boolean; // Флаг для отображения иконки создания
  activeIndex?: number; // Активный индекс для программного управления
  onPress?: (item: CarouselItemType) => void; // Обработчик нажатия на элемент
}

export const ItemCarousel = ({
  title,
  data,
  onSelectItem,
  modeConfig,
  colors,
  style,
  willCreate = false,
  activeIndex,
  onPress,
}: ItemCarouselProps) => {
  const styles = itemCarouselStyles(colors);

  // Проверяем наличие данных
  if (!data || !data.length) return null;

  return (
    <View style={[styles.carouselContainer, style]}>
      <PaddingLayout>
        <TitleText
          text={title}
          textColor={colors.contrast}
          element={<DotsIcon color={colors.contrast} size={22} />}
          variant="subTitle"
          style={styles.carouselTitleText}
        />
      </PaddingLayout>
      <Carousel
        height={130}
        mode="parallax"
        data={data}
        handler={onSelectItem}
        activeIndex={activeIndex}
        modeConfig={modeConfig}
        renderItem={TypedPreviewBlock({
          onPress,
          disableAnimate: true,
          previewMode: true,
          willCreate,
        })}
      />
    </View>
  );
};
