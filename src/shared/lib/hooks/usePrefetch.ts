import { goalsApi } from "@/src/entities/goals/api/goalsApi";
import { journalEntriesApi } from "@/src/entities/journals/api/journalEntriesApi";
import { summaryApi } from "@/src/entities/summary/api/summaryApi";
import { testResultsApi } from "@/src/entities/test-results/api/testResultsApi";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useAppDispatch } from "@/src/shared/store";
import { journalsApi } from "../../../entities";

/**
 * Простой хук для префетча данных перед навигацией
 * Использует RTK Query util.prefetch для предварительной загрузки данных
 */
export const usePrefetch = () => {
  const dispatch = useAppDispatch();

  /**
   * Префетч записей дневника по journal_id
   * @param journalId - ID дневника для загрузки записей
   */
  const prefetchJournalEntries = (journalId: string) => {
    const params = `journal_id=${journalId}&page=1&limit=50`;

    try {
      // Запускаем префетч записей дневника
      dispatch(
        journalEntriesApi.util.prefetch(
          "getJournalEntries",
          { params },
          { force: false }
        )
      );
    } catch (error) {
      // Игнорируем ошибки префетча - это не критично
      console.warn("Prefetch failed for journal entries:", error);
    }
  };

  /**
   * Префетч записей дневника по journal_id
   * @param journalId - ID дневника для загрузки записей
   */
  const prefetchJournals = () => {
    const params = `page=1&limit=10`;

    try {
      // Запускаем префетч записей дневника
      dispatch(
        journalsApi.util.prefetch("getJournals", { params }, { force: false })
      );
    } catch (error) {
      // Игнорируем ошибки префетча - это не критично
      console.warn("Prefetch failed for journals:", error);
    }
  };

  /**
   * Префетч результатов теста по test_id
   * @param testId - ID теста для загрузки результатов
   */
  const prefetchTestResults = (testId: string) => {
    const params = `test_id=${testId}&page=1&limit=50`;

    try {
      // Запускаем префетч результатов теста
      dispatch(
        testResultsApi.util.prefetch(
          "getTestResults",
          { params },
          { force: false }
        )
      );
    } catch (error) {
      // Игнорируем ошибки префетча - это не критично
      console.warn("Prefetch failed for test results:", error);
    }
  };

  /**
   * Префетч цели по ID
   * @param goalId - ID цели
   */
  const prefetchGoal = (goalId: string) => {
    try {
      dispatch(
        goalsApi.util.prefetch("getGoal", { id: goalId }, { force: false })
      );
    } catch (error) {
      console.warn("Prefetch failed for goal:", error);
    }
  };

  /**
   * Префетч саммари по ID
   * @param summaryId - ID саммари
   */
  const prefetchSummary = (summaryId: string) => {
    try {
      dispatch(
        summaryApi.util.prefetch(
          "getSummary",
          { id: summaryId },
          { force: false }
        )
      );
    } catch (error) {
      console.warn("Prefetch failed for summary:", error);
    }
  };

  /**
   * Универсальный префетч для отдельной сущности
   * @param entityType - тип сущности
   * @param entityId - ID сущности
   */
  const prefetchEntity = (entityType: string, entityId: string) => {
    switch (entityType) {
      case ENTITY_NAME.GOALS:
        prefetchGoal(entityId);
        break;
      case ENTITY_NAME.SUMMARIES:
        prefetchSummary(entityId);
        break;
      default:
        console.warn(`Unsupported entity type for prefetch: ${entityType}`);
    }
  };

  /**
   * Универсальный префетч для списка записей
   * @param entityType - тип родительской сущности (Journals или Tests)
   * @param parentId - ID родительской сущности
   */
  const prefetchEntityList = (entityType: string, parentId: string) => {
    if (entityType === ENTITY_NAME.JOURNALS) {
      prefetchJournalEntries(parentId);
    } else if (entityType === ENTITY_NAME.TESTS) {
      prefetchTestResults(parentId);
    }
  };

  return {
    // Префетч списков
    prefetchEntityList,
    prefetchJournalEntries,
    prefetchTestResults,
    prefetchJournals,

    // Префетч отдельных сущностей
    prefetchEntity,
    prefetchGoal,
    prefetchSummary,
  };
};
