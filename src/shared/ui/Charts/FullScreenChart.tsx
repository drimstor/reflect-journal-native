import React, {
  FC,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { PieChart } from "react-native-gifted-charts";
import { View } from "react-native";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { stringToColor } from "@/src/shared/lib/helpers/stringToColor";
import { getGradientColor } from "@/src/shared/lib/helpers/getGradientColor";
import { Text } from "@/src/shared/ui";
import { PortraitNode } from "@/src/entities";

// Пропсы компонента
interface FullScreenChartProps {
  title?: string;
  data: PortraitNode[];
  onPress?: (item: PortraitNode, index: number) => void;
}

// Интерфейс для imperative API
export interface FullScreenChartHandle {
  setFocusedItem: (index: number) => void;
}

const FullScreenChart = forwardRef<FullScreenChartHandle, FullScreenChartProps>(
  ({ data, onPress }, ref) => {
    const { window } = useDeviceStore();
    const { colors } = useThemeStore();
    const [focusedIndex, setFocusedIndex] = useState(0);

    useImperativeHandle(
      ref,
      () => ({
        setFocusedItem: (index: number) => {
          if (index >= 0 && index < data?.length) {
            setFocusedIndex(index);
          }
        },
      }),
      [data?.length]
    );

    if (!data) return null;

    // Подготовка данных для PieChart
    const pieData = data?.map((item, index) => {
      const baseColor = stringToColor(item.name);
      const gradientColor = getGradientColor(baseColor);

      return {
        value: item?.count,
        color: baseColor,
        gradientCenterColor: gradientColor,
        name: item.name,
        focused: focusedIndex === index,
      };
    });

    // Обработчик нажатия на сектор диаграммы
    const handlePiePress = (item: any, index: number) => {
      setFocusedIndex(index);
      if (onPress && data[index]) {
        onPress(data[index], index);
      }
    };

    const calculatePercentage = (value: number) => {
      return Math.round(
        (value / data?.reduce((acc, item) => acc + item?.count, 0)) * 100
      );
    };

    return (
      <PieChart
        data={pieData}
        donut
        showGradient
        radius={window.width / 2 - 80}
        innerRadius={window.width / 2 - 110}
        innerCircleColor={colors.secondary}
        sectionAutoFocus
        onPress={handlePiePress}
        innerCircleBorderWidth={1}
        strokeWidth={1}
        extraRadius={8}
        innerCircleBorderColor={colors.alternate}
        strokeColor={colors.alternate}
        centerLabelComponent={() => (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text font="bold" size="extraLarge" color={colors.contrast}>
              {calculatePercentage(data[focusedIndex]?.count)}%
            </Text>
            <Text
              style={{ textAlign: "center" }}
              font="bold"
              size="extraLarge"
              color={colors.contrast}
            >
              {data[focusedIndex]?.name}
            </Text>
          </View>
        )}
      />
    );
  }
);

export default FullScreenChart;
