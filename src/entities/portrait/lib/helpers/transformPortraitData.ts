import {
  PortraitNode,
  PortraitNodeType,
  PortraitStatsResponse,
  ChartDataset,
} from "../../model/types";

/**
 * Преобразует данные узла с type в формат с name для совместимости с DiagramChart
 * @param item Элемент для преобразования
 */
const convertTypeToNameFormat = (item: PortraitNodeType): PortraitNode => {
  return {
    name: item.type,
    type: item.type,
    category: item.type,
    count: item.count,
  };
};

/**
 * Преобразует данные статистики портрета в массив датасетов для чартов
 * @param data Данные статистики портрета
 * @returns Массив датасетов для чартов
 */
export const transformPortraitData = (
  data: PortraitStatsResponse | undefined,
  t: Function
): ChartDataset[] => {
  if (!data) return [];

  const result: ChartDataset[] = [];

  // Добавляем топ типов с правильным заголовком
  if (data.top_types && data.top_types.length > 0) {
    // Преобразуем массив PortraitNodeType в PortraitNode
    const convertedData = data.top_types.map(convertTypeToNameFormat);

    result.push({
      title: t("overview.chart.popularCategories"),
      data: convertedData,
    });
  }

  // Добавляем топ узлов
  if (data.top_nodes && data.top_nodes.length > 0) {
    result.push({
      title: t("overview.chart.popularTopics"),
      data: data.top_nodes,
    });
  }

  // Добавляем данные по каждому типу
  if (data.top_by_type) {
    Object.entries(data.top_by_type).forEach(([type, nodes]) => {
      if (nodes && nodes.length > 0) {
        result.push({
          title: type,
          data: nodes,
        });
      }
    });
  }

  return result;
};
