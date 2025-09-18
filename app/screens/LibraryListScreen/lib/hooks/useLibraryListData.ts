import {
  useGetJournalEntriesQuery,
  useGetTestResultsQuery,
} from "@/src/entities";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { EntityType } from "@/src/shared/model/types";

interface UseLibraryListDataProps {
  entityName: EntityType;
  params: string;
}

export const useLibraryListData = ({
  entityName,
  params,
}: UseLibraryListDataProps) => {
  const baseOptions = {
    refetchOnMountOrArgChange: true,
  };
  // Для записей в дневниках
  const {
    data: journalEntriesData,
    isFetching: isJournalEntriesFetching,
    isLoading: isJournalEntriesLoading,
  } = useGetJournalEntriesQuery(
    { params },
    {
      skip: entityName !== ENTITY_NAME.JOURNAL_ENTRIES,
      ...baseOptions,
    }
  );

  // Для результатов тестов
  const {
    data: testResultsData,
    isFetching: isTestResultsFetching,
    isLoading: isTestResultsLoading,
  } = useGetTestResultsQuery(
    { params },
    {
      skip: entityName !== ENTITY_NAME.TEST_RESULTS,
      ...baseOptions,
    }
  );

  // Конфигурация для данных и состояния загрузки
  const dataConfig = {
    [ENTITY_NAME.JOURNAL_ENTRIES]: journalEntriesData,
    [ENTITY_NAME.TEST_RESULTS]: testResultsData,
  };

  const fetchingConfig = {
    [ENTITY_NAME.JOURNAL_ENTRIES]: isJournalEntriesFetching,
    [ENTITY_NAME.TEST_RESULTS]: isTestResultsFetching,
  };

  const loadingConfig = {
    [ENTITY_NAME.JOURNAL_ENTRIES]: isJournalEntriesLoading,
    [ENTITY_NAME.TEST_RESULTS]: isTestResultsLoading,
  };

  return {
    data: dataConfig[entityName] ?? null,
    isFetching: fetchingConfig[entityName] ?? false,
    isLoading: loadingConfig[entityName] ?? false,
  };
};
