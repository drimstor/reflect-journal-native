import { PreviewBlock } from "@/src/features";
import { BOTTOM_SHEET_SCREEN_POINTS, PATHS } from "@/src/shared/const";
import { formatDate } from "@/src/shared/lib/helpers";
import {
  useBottomSheetIndexState,
  useLang,
  useT,
} from "@/src/shared/lib/hooks";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import { useTabBarStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheet,
  CalendarIcon,
  Chip,
  Layout,
  PaddingLayout,
} from "@/src/shared/ui";
import { SectionHeader } from "@/src/shared/ui/VirtualizedList/VirtualizedList";
import { Header, OverviewChartSlider } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

const OverviewScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { locale } = useLang();
  const { LARGE } = BOTTOM_SHEET_SCREEN_POINTS;
  const { deactivateItem, isItemActive } = useTabBarStore();
  const navigation = useNavigation<NavigationProps>();

  // Используем новый хук для управления индексом BottomSheet
  const { bottomSheetRef, bottomSheetIndex, snapToIndex } =
    useBottomSheetIndexState();

  const snapPoints = useMemo(() => {
    return [WINDOW_HEIGHT - 417, LARGE];
  }, [LARGE]);

  // Конфиг для блоков аналитики
  const analyticsBlocks = [
    {
      title: t("overview.analytics.dataOverview.title"),
      value: t("overview.analytics.dataOverview.value"),
      chipTitle: "Charts",
      chipColor: colors.color2,
      backgroundIcon: "Charts",
      path: PATHS.CHARTS,
    },
    {
      title: t("overview.analytics.relationshipMap.title"),
      value: t("overview.analytics.relationshipMap.value"),
      chipTitle: "Map",
      chipColor: colors.color5,
      backgroundIcon: "RelationshipMap",
      path: PATHS.RELATIONSHIP_MAP,
    },
    {
      title: t("overview.analytics.timeline.title"),
      value: t("overview.analytics.timeline.value"),
      chipTitle: t("shared.info.soon"),
      chipColor: colors.accent,
      backgroundIcon: "Timeline",
      path: "",
    },
  ];

  // Деактивируем PATHS.OVERVIEW при посещении
  useFocusEffect(
    useCallback(() => {
      if (isItemActive(PATHS.OVERVIEW)) {
        deactivateItem(PATHS.OVERVIEW);
      }
    }, [isItemActive])
  );

  // --------------------- //

  const onOpenListItem = (path: string) => {
    if (!path) return;
    // Проверяем текущий индекс для определения действий
    snapToIndex(1);

    if (bottomSheetIndex === 1) {
      return navigation.navigate(path);
    }

    setTimeout(() => {
      navigation.navigate(path);
    }, 400);
  };

  return (
    <Layout>
      <Header title={t("overview.title")} />

      <View style={{ marginTop: 14 }}>
        <OverviewChartSlider />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        scrollEnabled={false}
        paddingHorizontal={1}
        indicatorColor={colors.alternate}
        style={{ paddingTop: 10 }}
        onChange={snapToIndex}
      >
        <PaddingLayout style={{ marginVertical: 5 }}>
          <SectionHeader title={t("overview.analytics.sectionTitle")} />
        </PaddingLayout>
        <PaddingLayout style={{ gap: 18 }}>
          {analyticsBlocks.map((block, index) => (
            <PreviewBlock
              key={index}
              title={block.title}
              value={block.value}
              backgroundColor={index === 2 ? colors.light + 40 : colors.light}
              disableAnimate={index === 2}
              backgroundIcon={block.backgroundIcon as EntityType}
              onPress={() => onOpenListItem(block.path)}
              element={<Chip color={block.chipColor} title={block.chipTitle} />}
              infoBoxes={[
                {
                  label: t("shared.info.lastUpdated"),
                  value: formatDate(new Date().toISOString(), locale),
                  icon: <CalendarIcon color={colors.contrast} />,
                },
              ]}
            />
          ))}
        </PaddingLayout>
      </BottomSheet>
    </Layout>
  );
};

export default OverviewScreen;
