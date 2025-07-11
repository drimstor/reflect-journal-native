import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import React, { ReactElement, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import {
  CarouselRenderItem,
  ICarouselInstance,
  default as LibraryCarousel,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { createDotsStyles } from "./Carousel.styles";
import { PreviewCardProps } from "@/src/features/home/PreviewCard/PreviewCard";
import * as Haptics from "expo-haptics";

interface CarouselProps {
  height: number;
  width?: number;
  data: PreviewCardProps[] | any;
  renderItem: ({ item }: { item: PreviewCardProps }) => ReactElement;
  style?: StyleProp<ViewStyle>;
  mode?: "parallax";
  modeConfig?: {
    parallaxScrollingScale: number;
    parallaxScrollingOffset: number;
  };
  handler?: (index: number) => void;
}

const Carousel = ({
  height = 100,
  width,
  data = [],
  renderItem,
  style,
  modeConfig,
  handler,
  mode = "parallax",
}: CarouselProps) => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createDotsStyles(colors, theme);

  const onScrollStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const handleSnapToItem = (index: number) => {
    handler?.(index);
  };

  const shouldShowPagination = data.length > 1;

  return (
    <View style={style}>
      <LibraryCarousel
        ref={ref}
        width={width || window.width}
        height={height}
        data={data as []}
        scrollAnimationDuration={300}
        onScrollStart={onScrollStart}
        onSnapToItem={handleSnapToItem}
        renderItem={renderItem as CarouselRenderItem<never>}
        defaultIndex={0}
        onProgressChange={progress}
        mode={mode}
        modeConfig={modeConfig}
        enabled={shouldShowPagination}
      />
      {shouldShowPagination && (
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          containerStyle={styles.dotsContainer}
        />
      )}
    </View>
  );
};

export default Carousel;
