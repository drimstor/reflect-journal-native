import {
  useGetDailyAffirmationQuery,
  useGetDailyAdviceQuery,
} from "@/src/entities/affirmations/api/affirmationsApi";
import { useGetGoalsQuery } from "@/src/entities/goals/api/goalsApi";
import { useGetAllDocumentsQuery } from "@/src/entities/documents/api/documentsApi";
import {
  useGetPortraitStatsQuery,
  transformPortraitData,
} from "@/src/entities";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useEffect, useMemo } from "react";

/**
 * Кастомный хук для получения всех данных HomeScreen
 * Возвращает состояния загрузки и данные для всех виджетов
 */
export const useHomeScreenData = () => {
  const { locale } = useLang();
  const t = useT();

  const {
    data: affirmationData,
    isLoading: isAffirmationLoading,
    refetch: refetchAffirmation,
  } = useGetDailyAffirmationQuery();

  const {
    data: adviceData,
    isLoading: isAdviceLoading,
    refetch: refetchAdvice,
  } = useGetDailyAdviceQuery();

  const { data: goalsData, isLoading: isGoalsLoading } = useGetGoalsQuery({
    params: "page=1&limit=20",
  });

  const {
    data: documentsData,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useGetAllDocumentsQuery({});

  // Добавляем запрос портрета пользователя
  const { data: portraitData, isLoading: isPortraitLoading } =
    useGetPortraitStatsQuery({
      min_count: 1,
      limit: 5,
    });

  // Трансформируем данные портрета
  const chartDatasets = useMemo(
    () => transformPortraitData(portraitData, t),
    [portraitData, locale]
  );

  // Извлекаем категории и темы из трансформированных данных
  const portraitDataFormatted = useMemo(() => {
    if (!chartDatasets || chartDatasets.length === 0) {
      return {
        categories: [],
        topics: [],
      };
    }

    const categories =
      chartDatasets.find(
        (dataset) => dataset.title === t("overview.chart.popularCategories")
      )?.data || [];

    const topics =
      chartDatasets.find(
        (dataset) => dataset.title === t("overview.chart.popularTopics")
      )?.data || [];

    return {
      categories,
      topics,
    };
  }, [chartDatasets, t]);

  useEffect(() => {
    // Обновляем только если нет внешних данных
    if (!isAffirmationLoading && !isAdviceLoading) {
      refetchAffirmation();
      refetchAdvice();
      refetchDocuments();
    }
  }, [locale]);

  const isLoading =
    isAffirmationLoading ||
    isAdviceLoading ||
    isGoalsLoading ||
    isDocumentsLoading ||
    isPortraitLoading;

  return {
    isLoading,
    data: {
      affirmation: affirmationData,
      advice: adviceData,
      goals: goalsData,
      documents: documentsData,
      portrait: portraitDataFormatted,
    },
    loadingStates: {
      affirmation: isAffirmationLoading,
      advice: isAdviceLoading,
      goals: isGoalsLoading,
      documents: isDocumentsLoading,
      portrait: isPortraitLoading,
    },
  };
};
