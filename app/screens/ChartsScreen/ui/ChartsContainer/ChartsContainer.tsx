import React, { FC, ReactNode } from "react";
import { View, Animated, Pressable } from "react-native";
import { FullScreenChart } from "@/src/shared/ui";
import { ChartItem } from "../../model/types";
import { styles } from "./ChartsContainer.styles";

interface ChartsContainerProps {
  children?: ReactNode;
  mainChartData?: ChartItem[];
  subChartData?: ChartItem[];
  onMainChartPress: () => void;
  mainChartRef: React.RefObject<any>;
  subChartRef: React.RefObject<any>;
  animation: {
    scaleLess: Animated.AnimatedInterpolation<number>;
    scaleMore: Animated.AnimatedInterpolation<number>;
    opacityMore: Animated.AnimatedInterpolation<number>;
  };
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
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ scale: animation.scaleLess }],
          transformOrigin: "left top",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable onPress={onMainChartPress}>
          {mainChartData && (
            <FullScreenChart ref={mainChartRef} data={mainChartData} />
          )}
        </Pressable>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          top: 10,
          right: -30,
          transform: [{ scale: animation.scaleMore }],
          transformOrigin: "right bottom",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          opacity: animation.opacityMore,
          zIndex: -1,
        }}
      >
        {subChartData && (
          <FullScreenChart ref={subChartRef} data={subChartData} />
        )}
      </Animated.View>
      {children}
    </View>
  );
};
