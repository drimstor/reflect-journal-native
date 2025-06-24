import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";
import { ENTITY_NAME } from "../../../../shared/const/ENTITIES";

interface EditHookResult {
  editEntity: (data: any) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicEditHook = (
  variant: EntityType,
  entityId?: string
): EditHookResult => {
  // Ленивый импорт соответствующего хука
  let editHook;
  switch (variant) {
    case ENTITY_NAME.JOURNALS:
      const { useUpdateJournalMutation } = require("@/src/entities");
      editHook = useUpdateJournalMutation;
      break;
    case ENTITY_NAME.JOURNAL_ENTRIES:
      const { useUpdateJournalEntryMutation } = require("@/src/entities");
      editHook = useUpdateJournalEntryMutation;
      break;
    case ENTITY_NAME.CHATS:
      const { useUpdateChatMutation } = require("@/src/entities");
      editHook = useUpdateChatMutation;
      break;
    case ENTITY_NAME.GOALS:
      const { useUpdateGoalMutation } = require("@/src/entities");
      editHook = useUpdateGoalMutation;
      break;
    case ENTITY_NAME.SUMMARIES:
      const { useUpdateSummaryMutation } = require("@/src/entities");
      editHook = useUpdateSummaryMutation;
      break;
    case ENTITY_NAME.TEST_RESULTS:
      const { useUpdateTestResultMutation } = require("@/src/entities");
      editHook = useUpdateTestResultMutation;
      break;
    default:
      throw new Error(`Неподдерживаемый тип: ${variant}`);
  }

  // Используем полученный хук
  const [editMutation, { isLoading, isSuccess }] = editHook();

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
