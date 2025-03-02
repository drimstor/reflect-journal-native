import { useCallback } from "react";
import { useThemeStore } from "@/src/shared/store";
import { LibraryListVariant } from "@/src/shared/model/types";
import { Journal } from "@/src/entities/journals/model/types";
import { Chat } from "@/src/entities/chat/model/types";
import { Chip } from "@/src/shared/ui";
import { formatDate } from "@/src/shared/lib/helpers";
import { CalendarIcon, DocumentTextIcon } from "@/src/shared/ui/icons";
import { stringToColor } from "@/src/shared/lib/helpers";
import { PreviewBlock } from "@/src/features";

interface TypedPreviewBlockProps {
  variant?: LibraryListVariant;
  onPress: (item: Journal | Chat) => void;
  disableAnimate?: boolean;
}

const TypedPreviewBlock = ({
  variant,
  onPress,
  disableAnimate,
}: TypedPreviewBlockProps) => {
  const { colors } = useThemeStore();

  return useCallback(
    ({ item }: { item: any }) => {
      console.log({ item });
      const infoBoxesConfig = [
        {
          label: item.updated_at ? "Last updated" : "Created",
          value: formatDate(item.updated_at || item.created_at),
          icon: <CalendarIcon variant="outlined" color={colors.contrast} />,
        },
        ...(Number.isFinite(item.entries_count)
          ? [
              {
                label: "Entries count",
                value: String(item.entries_count),
                icon: <DocumentTextIcon color={colors.contrast} />,
              },
            ]
          : []),
      ];

      return (
        <PreviewBlock
          key={item.id}
          title={item.name}
          value={item.description}
          backgroundColor={colors.light}
          backgroundColorForAnimate={colors.alternate}
          backgroundIcon={variant || item.entity_type}
          bookmarked={item.bookmarked}
          checklist={item.checklist}
          disableAnimate={disableAnimate}
          element={
            item.related_topics?.[0] ? (
              <Chip
                color={stringToColor(item.related_topics[0])}
                title={item.related_topics[0]}
              />
            ) : null
          }
          onPress={() => onPress(item)}
          infoBoxes={infoBoxesConfig}
        />
      );
    },
    [colors, onPress]
  );
};

export default TypedPreviewBlock;
