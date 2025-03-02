import React from "react";
import { Journal } from "@/src/entities/journals/model/types";
import { Chat } from "@/src/entities/chat/model/types";
import { VirtualizedList } from "@/src/shared/ui";
import { useFiltersStore } from "@/src/shared/store";
import { getFiltersParams } from "@/src/shared/lib/helpers";
import { useGetAnyEntities } from "./lib/hooks/useGetAnyEntities";
import { LibraryListVariant } from "@/src/shared/model/types";
import { TypedPreviewBlock } from "..";

interface LibraryListProps {
  variant: LibraryListVariant;
  onPress: (item: Journal | Chat) => void;
}

function LibraryList({ variant, onPress }: LibraryListProps) {
  const filters = useFiltersStore();

  const { data, isLoading, isFetching } = useGetAnyEntities(
    variant,
    getFiltersParams(filters)
  );

  // const educationJournal: Journal = {
  //   name: "English Journal",
  //   description: "",
  //   related_topics: ["Education"],
  //   updated_at: "2025-04-04T12:00:00Z",
  //   created_at: "2025-04-04T12:00:00Z",
  //   id: "1",
  //   user_id: "1",
  //   ai_response: true,
  //   related_entities: [],
  // };

  // const gymJournal: Journal = {
  //   name: "GYM Progress Journal",
  //   description:
  //     "Journal about my progress in the gym. I'm trying to improve my strength and endurance.",
  //   related_topics: ["Sport"],
  //   updated_at: "2025-04-01T12:00:00Z",
  //   created_at: "2025-04-01T12:00:00Z",
  //   id: "1",
  //   user_id: "1",
  //   ai_response: true,
  //   related_entities: [],
  // };

  // const newData =
  //   variant === "Journals"
  //     ? {
  //         ...data,
  //         data: [educationJournal, gymJournal, ...(data?.data || [])],
  //         currentPage: data?.currentPage || 1,
  //         totalPages: data?.totalPages || 1,
  //         totalItems: data?.totalItems || 0,
  //       }
  //     : data;

  return (
    <VirtualizedList
      data={data}
      renderItem={TypedPreviewBlock({ variant, onPress })}
      isFetching={isFetching}
    />
  );
}

export default LibraryList;
