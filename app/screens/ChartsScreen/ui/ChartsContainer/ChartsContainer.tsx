import React, { FC, ReactNode } from "react";
import { View, Pressable } from "react-native";
import { FullScreenChart } from "@/src/shared/ui";
import { ChartItem } from "../../model/types";
import { styles } from "./ChartsContainer.styles";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";

interface ChartsContainerProps {
  children?: ReactNode;
  mainChartData?: ChartItem[];
  subChartData?: ChartItem[];
  onMainChartPress: () => void;
  mainChartRef: React.RefObject<any>;
  subChartRef: React.RefObject<any>;
  animation: SharedValue<number>;
}

export const ChartsContainer: FC<ChartsContainerProps> = ({
  children,
  mainChartData,
  subChartData,
  onMainChartPress,
  mainChartRef,
  subChartRef,
  animation,
}) => {
  const mainChartAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value, [0, 1], [1, 0.3]);

    return {
      transform: [{ scale }],
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      transformOrigin: "left top",
    };
  });

  const subChartAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value, [0, 1], [0.25, 1]);
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);

    return {
      position: "absolute",
      top: 10,
      right: -30,
      transform: [{ scale }],
      width: "100%",
      justifyContent: "center",
      transformOrigin: "right bottom",
      alignItems: "center",
      opacity,
      zIndex: -1,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={mainChartAnimatedStyle}>
        <Pressable onPress={onMainChartPress}>
          {mainChartData && (
            <FullScreenChart ref={mainChartRef} data={mainChartData} />
          )}
        </Pressable>
      </Animated.View>
      <Animated.View style={subChartAnimatedStyle}>
        {subChartData && (
          <FullScreenChart ref={subChartRef} data={subChartData} />
        )}
      </Animated.View>
      {children}
    </View>
  );
};
