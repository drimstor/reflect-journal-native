import {
  transformPortraitData,
  ChartDataset,
  useGetPortraitStatsQuery,
} from "@/src/entities";
import {
  DiagramChart,
  Loader,
  TinderCarousel,
  AnimatedAppearance,
  NoData,
} from "@/src/shared/ui";
import { View } from "react-native";
import { useMemo } from "react";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { PATHS } from "@/src/shared/const/PATHS";
// import { styles } from './OverviewChartSlider.styles';

/**
 * Компонент для отображения слайдера с диаграммами статистики портрета пользователя
 */
const OverviewChartSlider = () => {
  const { data, isLoading } = useGetPortraitStatsQuery({
    min_count: 1,
    limit: 5,
  });
  const { locale } = useLang();
  const { window } = useDeviceStore();
  const t = useT();
  const navigation = useNavigation<NavigationProps>();

  // Трансформируем данные в формат для диаграмм
  const chartDatasets = useMemo(
    () => transformPortraitData(data, t),
    [data, locale]
  );

  return (
    <View style={{ height: 350 }}>
      {isLoading ? (
        <Loader size={window.width - 130} />
      ) : !chartDatasets.length ? (
        <NoData
          style={{ marginTop: -15 }}
          type="noData"
          onPress={() => navigation.navigate(PATHS.ADD_ENTRY)}
        />
      ) : (
        <AnimatedAppearance isVisible>
          <TinderCarousel
            height={350}
            data={chartDatasets as any}
            renderItem={({ item }: { item: ChartDataset }) => (
              <DiagramChart title={item.title} data={item.data} />
            )}
          />
        </AnimatedAppearance>
      )}
    </View>
  );
};

export default OverviewChartSlider;
