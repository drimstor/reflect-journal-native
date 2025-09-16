import { PreviewCardProps } from "@/src/features/home/PreviewCard/PreviewCard";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import * as Haptics from "expo-haptics";
import { ReactElement, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  CarouselRenderItem,
  ICarouselInstance,
  default as LibraryCarousel,
  Pagination,
} from "react-native-reanimated-carousel";
import { createDotsStyles } from "./Carousel.styles";

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
  defaultIndex?: number;
  dotColors?: {
    dot: string;
    activeDot: string;
  };
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
  defaultIndex = 0,
  dotColors,
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
        defaultIndex={defaultIndex}
        onProgressChange={progress}
        mode={mode}
        modeConfig={modeConfig}
        enabled={shouldShowPagination}
      />
      {shouldShowPagination && (
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{
            ...styles.dot,
            ...(dotColors?.dot && { backgroundColor: dotColors?.dot }),
          }}
          activeDotStyle={{
            ...styles.activeDot,
            ...(dotColors?.activeDot && {
              backgroundColor: dotColors?.activeDot,
            }),
          }}
          containerStyle={styles.dotsContainer}
        />
      )}
    </View>
  );
};

export default Carousel;
