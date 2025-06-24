import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";
import { ENTITY_NAME } from "../../../../shared/const/ENTITIES";

interface DeleteHookResult {
  deleteEntity: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicDeleteHook = (
  variant: EntityType,
  entityId?: string
): DeleteHookResult => {
  // Ленивый импорт соответствующего хука
  let deleteHook;
  switch (variant) {
    case ENTITY_NAME.JOURNALS:
      const { useDeleteJournalMutation } = require("@/src/entities");
      deleteHook = useDeleteJournalMutation;
      break;
    case ENTITY_NAME.JOURNAL_ENTRIES:
      const { useDeleteJournalEntryMutation } = require("@/src/entities");
      deleteHook = useDeleteJournalEntryMutation;
      break;
    case ENTITY_NAME.CHATS:
      const { useDeleteChatMutation } = require("@/src/entities");
      deleteHook = useDeleteChatMutation;
      break;
    case ENTITY_NAME.GOALS:
      const { useDeleteGoalMutation } = require("@/src/entities");
      deleteHook = useDeleteGoalMutation;
      break;
    case ENTITY_NAME.SUMMARIES:
      const { useDeleteSummaryMutation } = require("@/src/entities");
      deleteHook = useDeleteSummaryMutation;
      break;
    case ENTITY_NAME.TEST_RESULTS:
      const { useDeleteTestResultMutation } = require("@/src/entities");
      deleteHook = useDeleteTestResultMutation;
      break;
    default:
      throw new Error(`Неподдерживаемый тип: ${variant}`);
  }

  // Используем полученный хук
  const [deleteMutation, { isLoading, isSuccess }] = deleteHook();

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
