import React, { ReactElement, useCallback } from "react";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import Carousel, {
  CarouselRenderItem,
  Pagination,
} from "react-native-reanimated-carousel";
import { useDeviceStore, useThemeStore } from "../../store";
import {
  PanGesture,
  PanGestureChangeEventPayload,
} from "react-native-gesture-handler";
import { PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { GestureUpdateEvent } from "react-native-gesture-handler";
import { View } from "react-native";
import { createDotsStyles } from "./Carousel.styles";

interface TinderCarouselProps {
  data: never[];
  renderItem: ({ item }: { item: never }) => ReactElement;
  height?: number;
  width?: number;
  isPagination?: boolean;
}

type GestureUpdateEventExtended = GestureUpdateEvent<
  PanGestureHandlerEventPayload & PanGestureChangeEventPayload
>;

const TinderCarousel = ({
  data = [],
  renderItem,
  height,
  width,
  isPagination = true,
}: TinderCarouselProps) => {
  const { window } = useDeviceStore();
  const WIDTH = width || window.width;
  const HEIGHT = height || window.height;
  const directionAnimVal = useSharedValue(0);

  const progress = useSharedValue(0);
  const { colors, theme } = useThemeStore();
  const styles = createDotsStyles(colors, theme);

  const shouldShowPagination = isPagination && data.length > 1;

  const animationStyle = useCallback(
    (value: number) => {
      "worklet";
      const translateY = interpolate(value, [0, 1], [0, -16]);

      const translateX =
        interpolate(value, [-1, 0], [WIDTH, 0], Extrapolation.CLAMP) *
        directionAnimVal.value;

      const rotateZ =
        interpolate(value, [-1, 0], [15, 0], Extrapolation.CLAMP) *
        directionAnimVal.value;

      const zIndex = Math.round(
        interpolate(
          value,
          [0, 1, 2, 3, 4],
          [50, 40, 30, 20, 10],
          Extrapolation.CLAMP
        )
      );

      const scale = interpolate(value, [0, 1], [1, 0.95]);

      const opacity = interpolate(
        value,
        [-1, -0.8, 0, 1],
        [0, 0.9, 1, 0.85],
        Extrapolation.EXTEND
      );

      return {
        transform: [
          { translateY },
          { translateX },
          { rotateZ: `${rotateZ}deg` },
          { scale },
        ],
        zIndex,
        opacity,
      };
    },
    [WIDTH, HEIGHT]
  );

  const onConfigurePanGesture = useCallback((g: PanGesture) => {
    g.onChange((e: GestureUpdateEventExtended) => {
      "worklet";
      directionAnimVal.value = Math.sign(e.translationX);
    });
  }, []);

  return (
    <View style={{ position: "relative" }}>
      <Carousel
        loop
        data={data}
        width={WIDTH}
        height={HEIGHT}
        defaultIndex={0}
        onConfigurePanGesture={onConfigurePanGesture}
        customAnimation={animationStyle}
        renderItem={renderItem as CarouselRenderItem<never>}
        onProgressChange={progress}
      />
      {shouldShowPagination && (
        <View
          style={{
            position: "absolute",
            bottom: HEIGHT / 10,
            left: 0,
            right: 0,
          }}
        >
          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            containerStyle={styles.dotsContainer}
          />
        </View>
      )}
    </View>
  );
};

export default TinderCarousel;
