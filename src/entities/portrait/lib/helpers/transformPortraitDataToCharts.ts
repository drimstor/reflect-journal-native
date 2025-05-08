import { PortraitStatsResponse } from "../../model/types";

/**
 * Тип для функции перевода
 */
type TFunction = (key: string) => string;

/**
 * Интерфейс для данных чарта
 */
export interface ChartData {
  title: string;
  data: any[];
}

/**
 * Интерфейс для набора чартов
 */
export interface ChartsDataset {
  [key: string]: ChartData;
}

/**
 * Преобразует данные статистики портрета в формат для ChartsScreen
 * @param data Данные статистики портрета
 * @param t Функция для локализации
 * @returns Объект с данными чартов в формате для ChartsScreen
 */
export const transformPortraitDataToCharts = (
  data: PortraitStatsResponse | undefined,
  t: TFunction
): ChartsDataset => {
  if (!data) return {};

  const result: ChartsDataset = {};

  // Добавляем топ типов как MainTopics
  if (data.top_types && data.top_types.length > 0) {
    // Преобразуем массив PortraitNodeType в формат для чарта
    const chartData = data.top_types.map((item) => ({
      name: item.type,
      type: item.type,
      category: "top_types",
      count: item.count,
    }));

    result.top_types = {
      title: t("overview.chart.popularCategories"),
      data: chartData,
    };
  }

  // Добавляем топ узлов
  if (data.top_nodes && data.top_nodes.length > 0) {
    result.top_nodes = {
      title: t("overview.chart.popularTopics"),
      data: data.top_nodes,
    };
  }

  // Добавляем данные по каждому типу
  if (data.top_by_type) {
    Object.entries(data.top_by_type).forEach(([type, nodes]) => {
      if (nodes && nodes.length > 0) {
        // Используем тип как ключ (например, "Эмоции", "События" и т.д.)
        result[type] = {
          title: type,
          data: nodes,
        };
      }
    });
  }

  return result;
};
