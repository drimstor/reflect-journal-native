import { formatDate } from "@/src/shared/lib/helpers";
import React, { useEffect } from "react";
import { Journal } from "@/src/entities/journals/model/types";
import { Chat } from "@/src/entities/chat/model/types";
import { Chip, VirtualizedList } from "@/src/shared/ui";
import { stringToColor } from "@/src/shared/lib/helpers";
import { CalendarIcon, DocumentTextIcon } from "@/src/shared/ui/icons";
import { useThemeStore, useFiltersStore } from "@/src/shared/store";
import { PreviewBlock } from "@/src/features";
import { getFiltersParams } from "@/src/shared/lib/helpers";
import { useGetAnyEntities } from "./lib/hooks/useGetAnyEntities";

export type LibraryListVariant = "Journals" | "Chats" | "Goals" | "Summaries";

interface LibraryListProps {
  variant: LibraryListVariant;
  onPress: (item: Journal | Chat) => void;
}

function LibraryList({ variant, onPress }: LibraryListProps) {
  const { colors } = useThemeStore();

  const filters = useFiltersStore();

  const { data, isLoading, isFetching } = useGetAnyEntities(
    variant,
    getFiltersParams(filters)
  );

  const renderItem = ({ item }: { item: Journal | Chat }) => {
    const journal = item as Journal;
    return (
      <PreviewBlock
        key={journal.id}
        title={journal.name}
        value={journal.description}
        backgroundColor={colors.light}
        backgroundColorForAnimate={colors.alternate}
        element={
          journal.related_topics[0] && (
            <Chip
              color={stringToColor(journal.related_topics[0])}
              title={journal.related_topics[0]}
            />
          )
        }
        backgroundIcon
        onPress={() => onPress(journal)}
        infoBoxes={[
          {
            label: "Last updated",
            value: formatDate(journal.updated_at),
            icon: <CalendarIcon variant="outlined" color={colors.contrast} />,
          },
          typeof journal.entries_count !== "undefined" &&
            ({
              label: "Entries count",
              value: journal.entries_count?.toString(),
              icon: <DocumentTextIcon color={colors.contrast} />,
            } as any),
        ]}
      />
    );
  };

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
      renderItem={renderItem}
      isFetching={isFetching}
    />
  );
}

export default LibraryList;
