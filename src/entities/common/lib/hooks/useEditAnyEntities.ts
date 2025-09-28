import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";
import { ENTITY_NAME } from "../../../../shared/const/ENTITIES";
// Статический импорт всех мутаций
import {
  useUpdateChatMutation,
  useUpdateGoalMutation,
  useUpdateJournalEntryMutation,
  useUpdateJournalMutation,
  useUpdateSummaryMutation,
  useUpdateTestResultMutation,
} from "@/src/entities";

interface EditHookResult {
  editEntity: (data: any) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicEditHook = (
  variant: EntityType,
  entityId?: string
): EditHookResult => {
  // Используем все хуки статически (мутации не поддерживают skip)
  const [updateJournal, journalState] = useUpdateJournalMutation();
  const [updateJournalEntry, journalEntryState] =
    useUpdateJournalEntryMutation();
  const [updateChat, chatState] = useUpdateChatMutation();
  const [updateGoal, goalState] = useUpdateGoalMutation();
  const [updateSummary, summaryState] = useUpdateSummaryMutation();
  const [updateTestResult, testResultState] = useUpdateTestResultMutation();

  // Выбираем активные функцию и состояние
  let editMutation, isLoading, isSuccess;
  switch (variant) {
    case ENTITY_NAME.JOURNALS:
      editMutation = updateJournal;
      isLoading = journalState.isLoading;
      isSuccess = journalState.isSuccess;
      break;
    case ENTITY_NAME.JOURNAL_ENTRIES:
      editMutation = updateJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
      break;
    case ENTITY_NAME.CHATS:
      editMutation = updateChat;
      isLoading = chatState.isLoading;
      isSuccess = chatState.isSuccess;
      break;
    case ENTITY_NAME.GOALS:
      editMutation = updateGoal;
      isLoading = goalState.isLoading;
      isSuccess = goalState.isSuccess;
      break;
    case ENTITY_NAME.SUMMARIES:
      editMutation = updateSummary;
      isLoading = summaryState.isLoading;
      isSuccess = summaryState.isSuccess;
      break;
    case ENTITY_NAME.TEST_RESULTS:
      editMutation = updateTestResult;
      isLoading = testResultState.isLoading;
      isSuccess = testResultState.isSuccess;
      break;
    default:
      editMutation = updateJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
  }

  // Метод редактирования с проверкой ID
  const handleEdit = useCallback(
    async (data: any) => {
      if (!entityId) return;

      // Для всех типов сущностей формат запроса: { id, body }
      await editMutation({ id: entityId, body: data });
    },
    [entityId, editMutation]
  );

  return {
    editEntity: handleEdit,
    isLoading,
    isSuccess,
  };
};

/**
 * Хук для редактирования любых сущностей
 *
 * Поля для редактирования по типам:
 * - Journals: name?, description?, related_topics?, ai_response?
 * - JournalEntries: content?, related_topics?, bookmarked?
 * - Chats: name?, description?, related_topics?, related_entities?, bookmarked?
 * - Goals: name?, bookmarked?, related_topics?
 * - Summaries: name?, related_topics?, bookmarked?
 */
export const useEditAnyEntities = <T extends EntityType>(
  variant: T,
  entityId?: string
): EditHookResult => {
  return useDynamicEditHook(variant, entityId);
};
