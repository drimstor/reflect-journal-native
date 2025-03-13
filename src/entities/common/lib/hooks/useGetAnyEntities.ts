import {
  Summary,
  useGetChatsQuery,
  useGetGoalsQuery,
  useGetSummariesQuery,
  useGetJournalsQuery,
} from "@/src/entities";
import { Chat } from "@/src/entities/chat/model/types";
import { Goal } from "@/src/entities/goals/model/types";
import { Journal } from "@/src/entities/journals/model/types";
import { LibraryListVariant } from "@/src/shared/model/types";

type ExcludeJournalEntries = Exclude<LibraryListVariant, "JournalEntries">;

type EntityType<T extends ExcludeJournalEntries> = T extends "Journals"
  ? Journal
  : T extends "Chats"
  ? Chat
  : T extends "Goals"
  ? Goal
  : T extends "Summaries"
  ? Summary
  : never;

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const useGetAnyEntities = <T extends ExcludeJournalEntries>(
  variant: T,
  params?: string
) => {
  const {
    data: Journals,
    isLoading: isJournalsLoading,
    isFetching: isJournalsFetching,
  } = useGetJournalsQuery({ params }, { skip: variant !== "Journals" });

  const {
    data: Chats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ params }, { skip: variant !== "Chats" });

  const {
    data: Goals,
    isLoading: isGoalsLoading,
    isFetching: isGoalsFetching,
  } = useGetGoalsQuery({ params }, { skip: variant !== "Goals" });

  const {
    data: Summaries,
    isLoading: isSummariesLoading,
    isFetching: isSummariesFetching,
  } = useGetSummariesQuery({ params }, { skip: variant !== "Summaries" });

  const dataConfig = {
    Journals,
    Chats,
    Goals,
    Summaries,
  };

  const loadingConfig = {
    Journals: isJournalsLoading,
    Chats: isChatsLoading,
    Goals: isGoalsLoading,
    Summaries: isSummariesLoading,
  };

  const fetchingConfig = {
    Journals: isJournalsFetching,
    Chats: isChatsFetching,
    Goals: isGoalsFetching,
    Summaries: isSummariesFetching,
  };

  return {
    data: dataConfig[variant] as PaginatedResponse<EntityType<T>>,
    isLoading: loadingConfig[variant],
    isFetching: fetchingConfig[variant],
  };
};
