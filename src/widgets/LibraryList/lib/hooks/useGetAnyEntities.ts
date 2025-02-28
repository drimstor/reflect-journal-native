import { useGetChatsQuery } from "@/src/entities";
import { useGetJournalsQuery } from "@/src/entities";
import { LibraryListVariant } from "../../LibraryList";
import { Chat } from "@/src/entities/chat/model/types";
import { Journal } from "@/src/entities/journals/model/types";

type EntityType<T extends LibraryListVariant> = T extends "Journals"
  ? Journal
  : Chat;

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const useGetAnyEntities = <T extends LibraryListVariant>(
  variant: T,
  params?: string
) => {
  const {
    data: journals,
    isLoading: isJournalsLoading,
    isFetching: isJournalsFetching,
  } = useGetJournalsQuery({ params }, { skip: variant !== "Journals" });

  const {
    data: chats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ params }, { skip: variant !== "Chats" });

  const data = variant === "Journals" ? journals : chats;
  const isLoading = variant === "Journals" ? isJournalsLoading : isChatsLoading;
  const isFetching =
    variant === "Journals" ? isJournalsFetching : isChatsFetching;

  return {
    data: data as PaginatedResponse<EntityType<T>>,
    isLoading,
    isFetching,
  };
};
