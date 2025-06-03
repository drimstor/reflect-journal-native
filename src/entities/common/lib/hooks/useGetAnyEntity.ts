import { useGetJournalEntryQuery } from "@/src/entities/journals/api/journalEntriesApi";
import { useGetGoalQuery } from "@/src/entities/goals/api/goalsApi";
import { useGetSummaryQuery } from "@/src/entities/summary/api/summaryApi";
import { JournalEntry } from "@/src/entities/journals/model/types";
import { Goal } from "@/src/entities/goals/model/types";
import { Summary } from "@/src/entities/summary/model/types";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";
import { EntityType } from "@/src/shared/model/types";
import { useGetJournalQuery } from "@/src/entities";

export type SingleEntity<T extends EntityType> = T extends "JournalEntry"
  ? JournalEntry
  : T extends "Goal"
  ? Goal
  : T extends "Summary"
  ? Summary
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
  if (type === ENTITY_PLURAL.JOURNAL) {
    return useGetJournalQuery({ id }, { skip });
  }
  if (type === ENTITY_PLURAL.JOURNAL_ENTRY) {
    return useGetJournalEntryQuery({ id }, { skip });
  }
  if (type === ENTITY_PLURAL.GOAL) {
    return useGetGoalQuery({ id }, { skip });
  }
  if (type === ENTITY_PLURAL.SUMMARY) {
    return useGetSummaryQuery({ id }, { skip });
  }

  return { data: null, isLoading: false, isError: false };
}
