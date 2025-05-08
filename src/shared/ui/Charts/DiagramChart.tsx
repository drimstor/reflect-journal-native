import React, { FC, useEffect, useState } from "react";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { View, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { stringToColor } from "@/src/shared/lib/helpers/stringToColor";
import { getGradientColor } from "@/src/shared/lib/helpers/getGradientColor";
import { Chip } from "..";
import { Text } from "@/src/shared/ui";
import { PortraitNode } from "@/src/entities";

interface DiagramChartProps {
  title?: string;
  data: PortraitNode[];
}

const DiagramChart: FC<DiagramChartProps> = ({ title = "Эмоции", data }) => {
  const { colors } = useThemeStore();
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Подготовка данных для PieChart
  const pieData = data?.map((item, index) => {
    const baseColor = stringToColor(item.name || item.type);
    const gradientColor = getGradientColor(baseColor);

    return {
      value: item.count,
      color: baseColor,
      gradientCenterColor: gradientColor,
      name: item.name || item.type,
      focused: focusedIndex === index,
    };
  });

  // Определение элемента с максимальным значением для центральной метки,
  // если не выбран элемент через чип
  const maxItem = pieData?.[focusedIndex];

  // Обработчик нажатия на сектор диаграммы
  const handlePiePress = (item: any, index: number) => {
    setFocusedIndex(index);
  };

  const calculatePercentage = (value: number) => {
    return Math.round(
      (value / data?.reduce((acc, item) => acc + item.count, 0)) * 100
    );
  };

  const renderLegendComponent = () => {
    return (
      <View
        style={{
          gap: 8,
          flexDirection: "column",
          justifyContent: "center",
          minWidth: "37%",
        }}
      >
        {pieData?.map((item, index) => (
          <TouchableOpacity
            key={`legend-item-${index}`}
            onPress={() => {
              setFocusedIndex(index);
            }}
          >
            <Chip
              borderColor={
                focusedIndex === index ? colors.contrast : "transparent"
              }
              title={
                item.name?.length > 15
                  ? `${item.name.slice(0, 15)}...`
                  : item.name
              }
              color={item.color}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View
      style={{
        margin: 24,
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.alternate,
      }}
    >
      <Text
        style={{ textAlign: "center" }}
        color={colors.contrast}
        size="large"
        font="bold"
      >
        {title}
      </Text>
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <PieChart
          data={pieData as pieDataItem[]}
          donut
          showGradient
          sectionAutoFocus
          radius={85}
          innerRadius={65}
          innerCircleColor={colors.secondary}
          onPress={handlePiePress}
          extraRadius={7}
          innerCircleBorderWidth={1}
          strokeWidth={1}
          innerCircleBorderColor={colors.alternate}
          strokeColor={colors.alternate}
          centerLabelComponent={() => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text font="bold" size="extraLarge" color={colors.contrast}>
                {calculatePercentage(maxItem?.value || 0)}
                <Text color={colors.contrast} size="large">
                  {"%"}
                </Text>
              </Text>
              <Text
                color={colors.contrast}
                size="medium"
                style={{ textAlign: "center" }}
              >
                {maxItem?.name}
              </Text>
            </View>
          )}
        />
        {renderLegendComponent()}
      </View>
    </View>
  );
};

export default DiagramChart;
