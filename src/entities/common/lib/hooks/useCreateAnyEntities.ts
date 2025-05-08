import { LibraryListVariant } from "@/src/shared/model/types";
import { useCallback } from "react";

interface CreateHookResult {
  createEntity: (data: any) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicCreateHook = (
  variant: LibraryListVariant
): CreateHookResult => {
  // Ленивый импорт соответствующего хука
  let createHook;
  switch (variant) {
    case "Journals":
      const { useCreateJournalMutation } = require("@/src/entities");
      createHook = useCreateJournalMutation;
      break;
    case "JournalEntries":
      const { useCreateJournalEntryMutation } = require("@/src/entities");
      createHook = useCreateJournalEntryMutation;
      break;
    case "Chats":
      const { useCreateChatMutation } = require("@/src/entities");
      createHook = useCreateChatMutation;
      break;
    case "Goals":
      const { useCreateGoalMutation } = require("@/src/entities");
      createHook = useCreateGoalMutation;
      break;
    case "Summaries":
      const { useCreateSummaryMutation } = require("@/src/entities");
      createHook = useCreateSummaryMutation;
      break;
    default:
    // throw new Error(`Неподдерживаемый тип: ${variant}`);
  }

  // Используем полученный хук
  const [createMutation, { isLoading, isSuccess }] = createHook();

  // Метод создания
  const handleCreate = useCallback(
    async (data: any) => {
      // Для разных типов сущностей формат запроса может отличаться
      let requestData;
      switch (variant) {
        case "JournalEntries":
          requestData = {
            journal_id: data.journal_id,
            content: data.content,
            bookmarked: data.bookmarked || false,
          };
          break;
        case "Journals":
          requestData = {
            name: data.name,
            description: data.description || "",
            related_topics: data.related_topics || [],
            ai_response: data.ai_response || false,
            bookmarked: data.bookmarked || false,
          };
          break;
        case "Chats":
          requestData = {
            name: data.name,
            description: data.description || "",
            related_topics: data.related_topics || [],
            bookmarked: data.bookmarked || false,
          };
          break;
        default:
          requestData = data;
          break;
      }

      try {
        return await createMutation(requestData).unwrap();
      } catch (error) {
        console.error(`Ошибка при создании ${variant}:`, error);
        throw error;
      }
    },
    [createMutation, variant]
  );

  return {
    createEntity: handleCreate,
    isLoading,
    isSuccess,
  };
};

/**
 * Хук для создания любых сущностей
 *
 * Поля для создания по типам:
 * - Journals: name, description?, related_topics?, ai_response?
 * - JournalEntries: journal_id, content, related_topics?, bookmarked?
 * - Chats: name, description?, related_topics?, bookmarked?
 * - Goals: name, related_topics?, bookmarked? (будет добавлено позже)
 * - Summaries: name, related_topics?, bookmarked? (будет добавлено позже)
 */
export const useCreateAnyEntities = <T extends LibraryListVariant>(
  variant: T
): CreateHookResult => {
  return useDynamicCreateHook(variant);
};
