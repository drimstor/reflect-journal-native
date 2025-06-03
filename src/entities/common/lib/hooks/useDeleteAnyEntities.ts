import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";

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
    case "Journals":
      const { useDeleteJournalMutation } = require("@/src/entities");
      deleteHook = useDeleteJournalMutation;
      break;
    case "JournalEntries":
      const { useDeleteJournalEntryMutation } = require("@/src/entities");
      deleteHook = useDeleteJournalEntryMutation;
      break;
    case "Chats":
      const { useDeleteChatMutation } = require("@/src/entities");
      deleteHook = useDeleteChatMutation;
      break;
    case "Goals":
      const { useDeleteGoalMutation } = require("@/src/entities");
      deleteHook = useDeleteGoalMutation;
      break;
    case "Summaries":
      const { useDeleteSummaryMutation } = require("@/src/entities");
      deleteHook = useDeleteSummaryMutation;
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
