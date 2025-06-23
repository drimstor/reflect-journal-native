import { Chat } from "@/src/entities/chat/model/types";
import { useGetAnyEntities } from "@/src/entities/common/lib/hooks/useGetAnyEntities";
import { Journal } from "@/src/entities/journals/model/types";
import { TypedPreviewBlock } from "@/src/features";
import { getFiltersParams } from "@/src/shared/lib/helpers";
import { EntityType } from "@/src/shared/model/types";
import { useFiltersStore, useScreenInfoStore } from "@/src/shared/store";
import { VirtualizedList } from "@/src/shared/ui";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ENTITY_NAME } from "../../shared/const/ENTITIES";

interface LibraryListProps {
  variant: Exclude<EntityType, "JournalEntries">;
  onPress: (item: Journal | Chat) => void;
}

function LibraryList({ variant, onPress }: LibraryListProps) {
  const filters = useFiltersStore();
  const { setScreenInfo } = useScreenInfoStore();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setScreenInfo({ name: variant });
    }, [variant])
  );

  const { data, isLoading, isFetching } = useGetAnyEntities(
    variant,
    getFiltersParams(filters),
    !isFocused
  );

  // useEffect(() => {
  //   if (isFocused) {
  //     filters.setPage(1);
  //   }
  // }, [isFocused]);

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
      sortField={variant === ENTITY_NAME.TESTS ? "created_at" : "updated_at"}
    />
  );
}

export default LibraryList;
