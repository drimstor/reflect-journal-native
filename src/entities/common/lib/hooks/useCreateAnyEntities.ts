import { normalizeDate } from "@/src/shared/lib/utils/dateFormatters";
import { EntityType } from "@/src/shared/model/types";
import { useCallback } from "react";
// Статический импорт всех мутаций
import {
  useCreateChatMutation,
  useCreateGoalMutation,
  useCreateJournalEntryMutation,
  useCreateJournalMutation,
  useCreateSummaryMutation,
} from "@/src/entities";

interface CreateHookResult {
  createEntity: (data: any) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
}

const useDynamicCreateHook = (variant: EntityType): CreateHookResult => {
  // Используем все хуки статически (мутации не поддерживают skip)
  const [createJournal, journalState] = useCreateJournalMutation();
  const [createChat, chatState] = useCreateChatMutation();
  const [createGoal, goalState] = useCreateGoalMutation();
  const [createSummary, summaryState] = useCreateSummaryMutation();
  const [createJournalEntry, journalEntryState] =
    useCreateJournalEntryMutation();

  // Выбираем активные функцию и состояние
  let createMutation, isLoading, isSuccess;
  switch (variant) {
    case "Journals":
      createMutation = createJournal;
      isLoading = journalState.isLoading;
      isSuccess = journalState.isSuccess;
      break;
    case "JournalEntries":
      createMutation = createJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
      break;
    case "Chats":
      createMutation = createChat;
      isLoading = chatState.isLoading;
      isSuccess = chatState.isSuccess;
      break;
    case "Goals":
      createMutation = createGoal;
      isLoading = goalState.isLoading;
      isSuccess = goalState.isSuccess;
      break;
    case "Summaries":
      createMutation = createSummary;
      isLoading = summaryState.isLoading;
      isSuccess = summaryState.isSuccess;
      break;
    default:
      createMutation = createJournalEntry;
      isLoading = journalEntryState.isLoading;
      isSuccess = journalEntryState.isSuccess;
  }

  // Метод создания
  const handleCreate = useCallback(
    async (data: any) => {
      // Для разных типов сущностей формат запроса может отличаться
      let requestData;
      switch (variant) {
        case "JournalEntries":
          // Для записей дневника всегда используем FormData
          const formData = new FormData();
          formData.append("content", data.content);
          formData.append("journal_id", data.journal_id);
          formData.append("bookmarked", String(data.bookmarked || false));

          if (data.created_at) {
            // Нормализуем дату к стандартному формату
            const normalizedDate = normalizeDate(data.created_at);
            formData.append("created_at", normalizedDate || data.created_at);
          }
          if (data.title) {
            formData.append("title", data.title);
          }
          if (data.mood) {
            formData.append("mood", data.mood);
          }

          // Добавляем изображения если есть
          if (data.images && data.images.length > 0) {
            data.images.forEach((image: any, index: number) => {
              formData.append(`images`, {
                uri: image.uri,
                name: `image_${index}.jpg`,
                type: "image/jpeg",
              } as any);
            });
          }

          requestData = formData;
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
export const useCreateAnyEntities = <T extends EntityType>(
  variant: T
): CreateHookResult => {
  return useDynamicCreateHook(variant);
};
