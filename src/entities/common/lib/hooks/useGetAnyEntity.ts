import {
  useGetJournalQuery,
  useGetTestQuery,
  useGetTestResultQuery,
} from "@/src/entities";
import { DocumentResponse } from "@/src/entities/documents/model/types";
import { useGetGoalQuery } from "@/src/entities/goals/api/goalsApi";
import { Goal } from "@/src/entities/goals/model/types";
import { useGetJournalEntryQuery } from "@/src/entities/journals/api/journalEntriesApi";
import { JournalEntry } from "@/src/entities/journals/model/types";
import { useGetSummaryQuery } from "@/src/entities/summary/api/summaryApi";
import { Summary } from "@/src/entities/summary/model/types";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { EntityType } from "@/src/shared/model/types";

export type SingleEntity<T extends EntityType> = T extends "JournalEntry"
  ? JournalEntry
  : T extends "Goal"
  ? Goal
  : T extends "Summary"
  ? Summary
  : T extends "Documents"
  ? DocumentResponse
  : never;

interface UseGetAnyEntityProps<T extends EntityType> {
  type: T;
  id: string;
  skip?: boolean;
}

/**
 * Универсальный хук для получения сущности по её типу и идентификатору
 * @param type - тип сущности (журнал, запись в журнале или цель)
 * @param id - идентификатор сущности
 * @param skip - флаг для пропуска запроса
 * @returns объект с данными сущности, состоянием загрузки и ошибки
 */
export function useGetAnyEntity<T extends EntityType>({
  type,
  id,
  skip,
}: UseGetAnyEntityProps<T>) {
  // Настройки для принудительного перезапроса данных
  const baseOptions = {
    refetchOnMountOrArgChange: true, // Перезапрашивать при каждом монтировании
    refetchOnFocus: true, // Перезапрашивать при фокусе на окно
  };

  // Вызываем все хуки безусловно
  const journalQuery = useGetJournalQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.JOURNALS }
  );
  const journalEntryQuery = useGetJournalEntryQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.JOURNAL_ENTRIES }
  );
  const goalQuery = useGetGoalQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.GOALS }
  );
  const summaryQuery = useGetSummaryQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.SUMMARIES }
  );
  const testResultQuery = useGetTestResultQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.TEST_RESULTS }
  );
  const testQuery = useGetTestQuery(
    { id },
    { ...baseOptions, skip: skip || type !== ENTITY_NAME.TESTS }
  );

  // Возвращаем результат нужного хука
  switch (type) {
    case ENTITY_NAME.JOURNALS:
      return journalQuery;
    case ENTITY_NAME.JOURNAL_ENTRIES:
      return journalEntryQuery;
    case ENTITY_NAME.GOALS:
      return goalQuery;
    case ENTITY_NAME.SUMMARIES:
      return summaryQuery;
    case ENTITY_NAME.TEST_RESULTS:
      return testResultQuery;
    case ENTITY_NAME.TESTS:
      return testQuery;
    default:
      return { data: null, isLoading: false, isError: false };
  }
}
