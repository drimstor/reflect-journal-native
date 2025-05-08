import { useMemo } from "react";
import {
  BottomSheet,
  CalendarIcon,
  Chip,
  Layout,
  PaddingLayout,
} from "@/src/shared/ui";
import { Header, OverviewChartSlider } from "@/src/widgets";
import { useT, useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useThemeStore, useDeviceStore } from "@/src/shared/store";
import { View } from "react-native";
import { PreviewBlock } from "@/src/features";
import { stringToColor } from "@/src/shared/lib/helpers";
import { SectionHeader } from "@/src/shared/ui/VirtualizedList/VirtualizedList";
import { LibraryListVariant, NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const";

const OverviewScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();

  // Используем новый хук для управления индексом BottomSheet
  const { bottomSheetRef, bottomSheetIndex, snapToIndex } =
    useBottomSheetIndexState();

  const snapPoints = useMemo(() => {
    return [window.height - 413, window.height - 85];
  }, [window.height]);

  // Конфиг для блоков аналитики
  const analyticsBlocks = [
    {
      title: t("overview.analytics.dataOverview.title"),
      value: t("overview.analytics.dataOverview.value"),
      chipTitle: "Charts",
      chipColor: stringToColor("Charts"),
      backgroundIcon: "Charts",
      path: PATHS.CHARTS,
    },
    {
      title: t("overview.analytics.relationshipMap.title"),
      value: t("overview.analytics.relationshipMap.value"),
      chipTitle: "Map",
      chipColor: stringToColor("Map"),
      backgroundIcon: "RelationshipMap",
      path: PATHS.RELATIONSHIP_MAP,
    },
    {
      title: t("overview.analytics.timeline.title"),
      value: t("overview.analytics.timeline.value"),
      chipTitle: "Soon",
      chipColor: colors.accent,
      backgroundIcon: "Timeline",
      path: "",
    },
  ];

  const navigation = useNavigation<NavigationProps>();

  navigation.addListener("focus", () => {
    setTimeout(() => {
      snapToIndex(0);
    }, 260);
  });

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
    }, 330);
  };

  return (
    <Layout>
      <Header title={t("overview.title")} />

      <View style={{ marginTop: 10 }}>
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
              backgroundColor={index === 2 ? colors.alternate : colors.light}
              disableAnimate={index === 2}
              backgroundColorForAnimate={colors.alternate}
              backgroundIcon={block.backgroundIcon as LibraryListVariant}
              onPress={() => onOpenListItem(block.path)}
              element={<Chip color={block.chipColor} title={block.chipTitle} />}
              infoBoxes={[
                {
                  label: t("shared.info.lastUpdated"),
                  value: "Aug 25",
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
