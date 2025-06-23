import {
  useGetChatsQuery,
  useGetGoalsQuery,
  useGetJournalsQuery,
  useGetSummariesQuery,
  useGetTestsQuery,
} from "@/src/entities";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { EntityType } from "@/src/shared/model/types";

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
/**
 * Хук для получения списка сущностей определенного типа
 *
 * Позволяет получить список сущностей (журналы, чаты, цели или саммари) в зависимости от переданного типа.
 * Использует соответствующие RTK Query хуки для каждого типа сущности.
 *
 * @param variant - Тип сущности (Journal, Chat, Goal, Summary, Test, TestResult)
 * @param params - Строка с параметрами запроса
 * @param skip - Флаг для пропуска запроса
 * @returns Объект с данными и состоянием загрузки для выбранного типа сущности
 */
export const useGetAnyEntities = <T extends EntityType>(
  variant: T,
  params?: string,
  skip?: boolean
) => {
  const {
    data: Journals,
    isLoading: isJournalsLoading,
    isFetching: isJournalsFetching,
  } = useGetJournalsQuery(
    { params },
    { skip: variant !== ENTITY_NAME.JOURNALS || skip }
  );

  const {
    data: Chats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery(
    { params },
    { skip: variant !== ENTITY_NAME.CHATS || skip }
  );

  const {
    data: Goals,
    isLoading: isGoalsLoading,
    isFetching: isGoalsFetching,
  } = useGetGoalsQuery(
    { params },
    { skip: variant !== ENTITY_NAME.GOALS || skip }
  );

  const {
    data: Summaries,
    isLoading: isSummariesLoading,
    isFetching: isSummariesFetching,
  } = useGetSummariesQuery(
    { params },
    { skip: variant !== ENTITY_NAME.SUMMARIES || skip }
  );

  const {
    data: Tests,
    isLoading: isTestsLoading,
    isFetching: isTestsFetching,
  } = useGetTestsQuery(
    { params },
    { skip: variant !== ENTITY_NAME.TESTS || skip }
  );

  const dataConfig = {
    Journals,
    Chats,
    Goals,
    Summaries,
    Tests,
  };

  const loadingConfig = {
    Journals: isJournalsLoading,
    Chats: isChatsLoading,
    Goals: isGoalsLoading,
    Summaries: isSummariesLoading,
    Tests: isTestsLoading,
  };

  const fetchingConfig = {
    Journals: isJournalsFetching,
    Chats: isChatsFetching,
    Goals: isGoalsFetching,
    Summaries: isSummariesFetching,
    Tests: isTestsFetching,
  };

  return {
    data: dataConfig[
      variant as keyof typeof dataConfig
    ] as unknown as PaginatedResponse<EntityType>,
    isLoading: loadingConfig[variant as keyof typeof loadingConfig],
    isFetching: fetchingConfig[variant as keyof typeof fetchingConfig],
  };
};
