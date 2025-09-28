import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";
import { ENTITY_NAME } from "../../../../shared/const/ENTITIES";
// Статический импорт всех мутаций
import {
  useDeleteChatMutation,
  useDeleteGoalMutation,
  useDeleteJournalEntryMutation,
  useDeleteJournalMutation,
  useDeleteSummaryMutation,
  useDeleteTestResultMutation,
} from "@/src/entities";

interface DeleteHookResult {
  deleteEntity: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicDeleteHook = (
  variant: EntityType,
  entityId?: string
): DeleteHookResult => {
  // Используем все хуки статически (мутации не поддерживают skip)
  const [deleteJournal, journalState] = useDeleteJournalMutation();
  const [deleteJournalEntry, journalEntryState] =
    useDeleteJournalEntryMutation();
  const [deleteChat, chatState] = useDeleteChatMutation();
  const [deleteGoal, goalState] = useDeleteGoalMutation();
  const [deleteSummary, summaryState] = useDeleteSummaryMutation();
  const [deleteTestResult, testResultState] = useDeleteTestResultMutation();

  // Выбираем активные функцию и состояние
  let deleteMutation, isLoading, isSuccess;
  switch (variant) {
    case ENTITY_NAME.JOURNALS:
      deleteMutation = deleteJournal;
      isLoading = journalState.isLoading;
      isSuccess = journalState.isSuccess;
      break;
    case ENTITY_NAME.JOURNAL_ENTRIES:
      deleteMutation = deleteJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
      break;
    case ENTITY_NAME.CHATS:
      deleteMutation = deleteChat;
      isLoading = chatState.isLoading;
      isSuccess = chatState.isSuccess;
      break;
    case ENTITY_NAME.GOALS:
      deleteMutation = deleteGoal;
      isLoading = goalState.isLoading;
      isSuccess = goalState.isSuccess;
      break;
    case ENTITY_NAME.SUMMARIES:
      deleteMutation = deleteSummary;
      isLoading = summaryState.isLoading;
      isSuccess = summaryState.isSuccess;
      break;
    case ENTITY_NAME.TEST_RESULTS:
      deleteMutation = deleteTestResult;
      isLoading = testResultState.isLoading;
      isSuccess = testResultState.isSuccess;
      break;
    default:
      deleteMutation = deleteJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
  }

  // Метод удаления с проверкой ID
  const handleDelete = useCallback(async () => {
    if (!entityId) return;
    await deleteMutation(entityId);
  }, [entityId, deleteMutation]);

  return {
    deleteEntity: handleDelete,
    isLoading,
    isSuccess,
  };
};

/**
 * Хук для удаления любых сущностей
 */
export const useDeleteAnyEntities = <T extends EntityType>(
  variant: T,
  entityId?: string
): DeleteHookResult => {
  return useDynamicDeleteHook(variant, entityId);
};
