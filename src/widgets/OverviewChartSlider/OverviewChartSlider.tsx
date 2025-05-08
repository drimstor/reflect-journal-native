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
} from "@/src/shared/ui";
import { View } from "react-native";
import { useMemo } from "react";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
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

  // Трансформируем данные в формат для диаграмм
  const chartDatasets = useMemo(
    () => transformPortraitData(data, t),
    [data, locale]
  );

  return (
    <View style={{ height: 350 }}>
      {isLoading ? (
        <Loader size={window.width - 130} />
      ) : (
        <AnimatedAppearance isVisible={!isLoading && !!data}>
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
