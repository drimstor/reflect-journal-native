import type { PortraitNode } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { stringToColor } from "@/src/shared/lib/helpers";
import { useGetPadding, useT } from "@/src/shared/lib/hooks";
import { StackNavigationProps } from "@/src/shared/model/types";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import { Chip, PaddingLayout, TitleText } from "@/src/shared/ui";
import { ArrowLeftIcon, ChartBoxIcon, DirectIcon } from "@/src/shared/ui/icons";
import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { styles } from "./CategoriesWidget.styles";

interface CategoriesWidgetProps {
  /** Данные категорий */
  data?: PortraitNode[];
}

const CategoriesWidget: FC<CategoriesWidgetProps> = ({ data }) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const navigation = useNavigation<StackNavigationProps>();

  const { navigateToFlow, setBottomSheetVisible, setActions, setFlowData } =
    useBottomSheetStore();

  // Функция для открытия списка переключения типов диаграмм
  const openBottomSheetList = (entities?: string[]) => {
    const listActions = [
      {
        text: t("edit.summaries.create"),
        IconComponent: DirectIcon,
        onPress: () => {
          setFlowData({ variant: "categories", entitiesValues: entities });
          navigateToFlow("summary", "create");
        },
      },
      {
        text: t("overview.analytics.dataOverview.title"),
        IconComponent: ChartBoxIcon,
        onPress: () => {
          setBottomSheetVisible(false);
          navigation.navigate(PATHS.CHARTS, {
            isBottomSheetMountAnimate: true,
          });
        },
      },
    ];

    setActions(listActions);
    navigateToFlow("common", "list");

    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <PaddingLayout style={styles.globalBox}>
        <View style={styles.titleBoxWithButton}>
          <TitleText
            text={t("overview.chart.popularCategories")}
            textColor={colors.contrast}
          />
          <TouchableOpacity
            style={styles.arrowLeftIconBox}
            onPress={() =>
              navigation.navigate(PATHS.CHARTS, {
                isBottomSheetMountAnimate: true,
              })
            }
          >
            <ArrowLeftIcon color={colors.contrast} size={26} />
          </TouchableOpacity>
        </View>
      </PaddingLayout>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.shortPreviewScrollViewHorizontal,
          { paddingHorizontal, gap: 8 },
        ]}
      >
        {data.map((category: PortraitNode, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => openBottomSheetList([category.name])}
          >
            <Chip
              key={index}
              title={`${category.name} (${category.count})`}
              size="base"
              color={stringToColor(category.name)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default CategoriesWidget;
