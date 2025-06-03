import { useCallback } from "react";
import { useFiltersStore, useThemeStore } from "@/src/shared/store";
import { EntityType } from "@/src/shared/model/types";
import { Journal } from "@/src/entities/journals/model/types";
import { Chat } from "@/src/entities/chat/model/types";
import { Chip, CheckBox } from "@/src/shared/ui";
import { formatDate } from "@/src/shared/lib/helpers";
import { CalendarIcon, DocumentTextIcon } from "@/src/shared/ui/icons";
import { stringToColor } from "@/src/shared/lib/helpers";
import { PreviewBlock } from "@/src/features";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { View } from "react-native";
import { useMultiSelection } from "@/src/entities";

interface TypedPreviewBlockProps {
  variant?: EntityType;
  onPress?: (item: Journal | Chat) => void;
  disableAnimate?: boolean;
  previewMode?: boolean;
  willCreate?: boolean;
}

const TypedPreviewBlock = ({
  variant,
  onPress,
  disableAnimate,
  previewMode,
  willCreate,
}: TypedPreviewBlockProps) => {
  const { colors } = useThemeStore();
  const t = useT();
  const { locale } = useLang();
  const filters = useFiltersStore();

  return useCallback(
    ({ item }: { item: any }) => {
      const infoBoxesConfig = [
        {
          label: willCreate
            ? t("shared.info.willCreate")
            : item?.updated_at
            ? t("shared.info.lastUpdated")
            : t("shared.info.created"),
          value: formatDate(item?.updated_at || item?.created_at, locale),
          icon: <CalendarIcon color={colors.contrast} />,
        },
        ...(Number.isFinite(item?.entries_count)
          ? [
              {
                label: t("shared.info.entriesCount"),
                value: String(item?.entries_count),
                icon: <DocumentTextIcon color={colors.contrast} />,
              },
            ]
          : []),
      ];

      const { selectionMode, isSelected, handleItemPress } = useMultiSelection({
        itemId: item?.id,
        onPress: () => onPress?.(item),
      });

      return (
        <PreviewBlock
          key={item?.id}
          title={item?.name}
          value={item?.description}
          backgroundColor={colors.light}
          backgroundColorForAnimate={colors.alternate}
          backgroundIcon={variant || item?.entity_type}
          bookmarked={item?.bookmarked}
          checklist={item?.checklist}
          disableAnimate={disableAnimate || selectionMode}
          previewMode={previewMode}
          onPress={handleItemPress}
          infoBoxes={infoBoxesConfig}
          element={
            selectionMode ? (
              <View style={{ width: 26, height: 26 }}>
                <CheckBox
                  checked={isSelected || false}
                  onPress={handleItemPress}
                  checkedColor={colors.accent}
                />
              </View>
            ) : item?.related_topics?.[0] ? (
              <Chip
                color={stringToColor(item?.related_topics[0])}
                title={item?.related_topics[0]}
              />
            ) : item?.entity_type ? (
              <Chip
                color={stringToColor(
                  t(`entities.${item?.entity_type.toLowerCase()}.singular`)
                )}
                title={t(
                  `entities.${item?.entity_type.toLowerCase()}.singular`
                )}
              />
            ) : null
          }
        />
      );
    },
    [colors, onPress, filters]
  );
};

export default TypedPreviewBlock;
