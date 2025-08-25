import {
  transformPortraitData,
  useGetPortraitStatsQuery,
} from "@/src/entities";
import {
  useGetDailyAdviceQuery,
  useGetDailyAffirmationQuery,
} from "@/src/entities/affirmations/api/affirmationsApi";
import { useGetAllDocumentsQuery } from "@/src/entities/documents/api/documentsApi";
import { useGetGoalsQuery } from "@/src/entities/goals/api/goalsApi";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useAdviceCategoriesFilter } from "@/src/shared/lib/hooks/useAdviceCategoriesFilter";
import { useEffect, useMemo } from "react";

/**
 * Кастомный хук для получения всех данных HomeScreen
 * Возвращает состояния загрузки и данные для всех виджетов
 */
export const useHomeScreenData = () => {
  const { locale } = useLang();
  const t = useT();

  // Получение исключенных категорий для советов
  const { excludedCategories } = useAdviceCategoriesFilter();

  const {
    data: affirmationData,
    isLoading: isAffirmationLoading,
    refetch: refetchAffirmation,
  } = useGetDailyAffirmationQuery();

  const {
    data: adviceData,
    isLoading: isAdviceLoading,
    refetch: refetchAdvice,
    isError: isAdviceError,
  } = useGetDailyAdviceQuery({ excluded_categories: excludedCategories });

  const { data: goalsData, isLoading: isGoalsLoading } = useGetGoalsQuery({
    params: "page=1&limit=3",
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
      advice: isAdviceError ? undefined : adviceData,
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
    refetch: {
      refetchAffirmation,
      refetchAdvice,
      refetchDocuments,
    },
  };
};
