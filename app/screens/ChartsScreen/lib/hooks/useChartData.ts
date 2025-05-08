import { useMemo } from "react";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useFiltersStore } from "@/src/shared/store";
import {
  transformPortraitDataToCharts,
  useGetPortraitStatsQuery,
} from "@/src/entities";
import { ChartsDataType } from "../../model/types";

export const useChartData = (): {
  chartsData: ChartsDataType;
  isLoading: boolean;
} => {
  const t = useT();
  const { locale } = useLang();

  const {
    sort_field,
    sort_order,
    search,
    related_topics,
    updated_at_from,
    updated_at_to,
    limit,
    category,
  } = useFiltersStore();

  // Запрос на получение данных с учетом фильтров
  const { data, isLoading } = useGetPortraitStatsQuery({
    min_count: 1,
    limit,
    category,
    updated_at_from,
    updated_at_to,
    related_topics,
    sort_field: sort_field as "count" | "name" | "updated_at",
    sort_order,
    search,
  });

  // Трансформируем данные в формат для диаграмм
  const chartsData = useMemo(
    () => transformPortraitDataToCharts(data, t),
    [data, locale]
  );

  return { chartsData, isLoading };
};
