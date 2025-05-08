import React from "react";
import { View } from "react-native";
import { Carousel, PaddingLayout, TitleText, DotsIcon } from "@/src/shared/ui";
import { TypedPreviewBlock } from "@/src/features";
import { ThemeColors } from "@/src/shared/model/types";
import { itemCarouselStyles } from "./ItemCarousel.styles";

// Тип элемента для карусели
type CarouselItemType = {
  [key: string]: any;
  name: string;
};

interface ItemCarouselProps {
  // Заголовок карусели
  title: string;
  // Данные для карусели
  data: Array<CarouselItemType> | undefined;
  // Обработчик выбора элемента
  onSelectItem: (index: number) => void;
  // Конфигурация режима карусели
  modeConfig: {
    parallaxScrollingScale: number;
    parallaxScrollingOffset: number;
    parallaxAdjacentItemScale: number;
  };
  // Цвета темы
  colors: ThemeColors;
  // Опциональный стиль для контейнера
  style?: any;
  // Флаг для отображения иконки создания
  willCreate?: boolean;
}

export const ItemCarousel = ({
  title,
  data,
  onSelectItem,
  modeConfig,
  colors,
  style,
  willCreate = false,
}: ItemCarouselProps) => {
  const styles = itemCarouselStyles(colors);

  // Проверяем наличие данных
  if (!data || data.length === 0) {
    return null;
  }

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
        modeConfig={modeConfig}
        renderItem={TypedPreviewBlock({
          onPress: () => {},
          disableAnimate: true,
          previewMode: true,
          willCreate,
        })}
      />
    </View>
  );
};
