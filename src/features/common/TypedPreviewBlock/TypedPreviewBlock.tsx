import { useMultiSelection } from "@/src/entities";
import { Chat } from "@/src/entities/chat/model/types";
import { Journal } from "@/src/entities/journals/model/types";
import { PreviewBlock } from "@/src/features";
import {
  formatDate,
  stringToColor,
  truncateText,
} from "@/src/shared/lib/helpers";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { CheckBox, Chip } from "@/src/shared/ui";
import {
  CalendarIcon,
  ClipboardTextIcon,
  DocumentTextIcon,
  TimerIcon,
} from "@/src/shared/ui/icons";
import { View } from "react-native";
import { ENTITY_NAME } from "../../../shared/const/ENTITIES";

interface TypedPreviewBlockProps {
  item: any;
  variant?: EntityType;
  onPress?: (item: Journal | Chat) => void;
  disableAnimate?: boolean;
  previewMode?: boolean;
  willCreate?: boolean;
  backgroundColor?: string;
}

export const TypedPreviewBlock = ({
  item,
  variant,
  onPress,
  disableAnimate,
  previewMode,
  willCreate,
  backgroundColor,
}: TypedPreviewBlockProps) => {
  const { colors } = useThemeStore();
  const t = useT();
  const { locale } = useLang();

  const infoBoxesConfig = [
    ...(variant !== ENTITY_NAME.TESTS
      ? [
          {
            label: willCreate
              ? t("shared.info.willCreate")
              : item?.updated_at
              ? t("shared.info.lastUpdated")
              : t("shared.info.created"),
            value: formatDate(item?.updated_at || item?.created_at, locale),
            icon: <CalendarIcon color={colors.contrast} />,
          },
        ]
      : []),
    ...(Number.isFinite(item?.entries_count)
      ? [
          {
            label: t("shared.info.entriesCount"),
            value: String(item?.entries_count),
            icon: <DocumentTextIcon color={colors.contrast} />,
          },
        ]
      : []),
    ...(variant === ENTITY_NAME.TESTS && item?.type && item?.lead_time
      ? [
          {
            label: t("test.leadTime"),
            value: `${item?.lead_time} ${t("shared.time.minutes")}`,
            icon: <TimerIcon color={colors.contrast} />,
          },
          {
            label: t("shared.info.type"),
            value: t(`test.type.${item?.type}`),
            icon: <ClipboardTextIcon color={colors.contrast} />,
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
      backgroundColor={backgroundColor}
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
            title={truncateText(item?.related_topics[0])}
          />
        ) : item?.entity_type ? (
          <Chip
            color={item?.chipColor}
            title={t(`entities.${item?.entity_type.toLowerCase()}.singular`)}
          />
        ) : null
      }
    />
  );
};

// Wrapper для использования в рендерах списков
export const createTypedPreviewBlockRenderer = (
  props: Omit<TypedPreviewBlockProps, "item">
) => {
  const TypedPreviewBlockRenderer = ({ item }: { item: any }) => (
    <TypedPreviewBlock {...props} item={item} />
  );

  TypedPreviewBlockRenderer.displayName = "TypedPreviewBlockRenderer";

  return TypedPreviewBlockRenderer;
};
