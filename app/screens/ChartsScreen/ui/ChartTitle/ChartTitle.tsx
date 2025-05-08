import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Text, ArrowLeftIcon } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { styles } from "./ChartTitle.styles";

interface ChartTitleProps {
  title: string;
  isMainChart: boolean;
  onChangeChartType?: () => void;
  onPressBack?: () => void;
}

export const ChartTitle: FC<ChartTitleProps> = ({
  title,
  isMainChart,
  onChangeChartType,
  onPressBack,
}) => {
  const { colors } = useThemeStore();

  if (isMainChart) {
    return (
      <Pressable onPress={onChangeChartType}>
        <View style={styles.mainChartTitle}>
          <Text color={colors.contrast} size="extraLarge" font="bold">
            {title}
          </Text>
          <View style={styles.arrowIcon}>
            <ArrowLeftIcon color={colors.contrast} size={18} />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPressBack}>
      <Text
        style={styles.subChartTitle}
        color={colors.contrast}
        size="extraLarge"
        font="bold"
      >
        {title}
      </Text>
    </Pressable>
  );
};
