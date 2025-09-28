import { JournalEntry, TestResult, useMultiSelection } from "@/src/entities";
import { PreviewBlock } from "@/src/features";
import { PATHS } from "@/src/shared/const";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { formatDate } from "@/src/shared/lib/helpers";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { CheckBox } from "@/src/shared/ui";
import { CalendarIcon, CheckIcon, GalleryIcon } from "@/src/shared/ui/icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

// Компонент для рендера записи журнала
interface JournalEntryItemProps {
  item: JournalEntry;
  entityName: EntityType;
  related_entities: any[];
}

const JournalEntryItem = ({
  item,
  entityName,
  related_entities,
}: JournalEntryItemProps) => {
  const t = useT();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const journal = item as JournalEntry;

  const onPress = () => {
    navigation.navigate(PATHS.LIBRARY_ITEM, {
      variant: entityName,
      item: { ...journal, related_entities },
    });
  };

  const { selectionMode, isSelected, handleItemPress } = useMultiSelection({
    itemId: journal?.id,
    onPress,
  });

  return (
    <PreviewBlock
      key={journal.id}
      value={journal.content}
      tags={journal.related_topics}
      bookmarked={journal.bookmarked}
      title={journal.title}
      disableAnimate={selectionMode}
      previewMode
      valueOpacity=""
      element={
        selectionMode && (
          <View style={{ width: 26, height: 26 }}>
            <CheckBox
              checked={isSelected || false}
              onPress={handleItemPress}
              checkedColor={colors.accent}
            />
          </View>
        )
      }
      onPress={handleItemPress}
      infoBoxes={[
        {
          label: t("shared.info.created"),
          value: formatDate(journal.created_at, locale),
          icon: <CalendarIcon color={colors.contrast} />,
        },
        ...(journal.images && journal.images.length > 0
          ? [
              {
                label: t("libraryItem.images"),
                value: String(journal.images.length),
                icon: <GalleryIcon color={colors.contrast} />,
              },
            ]
          : []),
      ]}
    />
  );
};

// Компонент для рендера результата теста
interface TestResultItemProps {
  item: TestResult;
  entityName: EntityType;
}

const TestResultItem = ({ item, entityName }: TestResultItemProps) => {
  const t = useT();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const result = item as TestResult;

  const onPress = () => {
    navigation.navigate(PATHS.LIBRARY_ITEM, {
      variant: entityName,
      item: result,
    });
  };

  const { selectionMode, isSelected, handleItemPress } = useMultiSelection({
    itemId: result?.id,
    onPress,
  });

  return (
    <View key={result.id}>
      <PreviewBlock
        value={result.content || t("test.noAnalysis")}
        tags={result.related_topics}
        bookmarked={result.bookmarked}
        title={t("entities.testresults.singular")}
        disableAnimate={selectionMode}
        previewMode
        valueOpacity=""
        element={
          selectionMode && (
            <View style={{ width: 26, height: 26 }}>
              <CheckBox
                checked={isSelected || false}
                onPress={handleItemPress}
                checkedColor={colors.accent}
              />
            </View>
          )
        }
        onPress={handleItemPress}
        infoBoxes={[
          {
            label: t("shared.info.created"),
            value: formatDate(result.created_at, locale),
            icon: <CalendarIcon color={colors.contrast} />,
          },
          {
            label: t("shared.info.progress"),
            value: `${
              Object.values(result.answers || {}).filter(Boolean).length
            } ${t("shared.info.of")} ${
              Object.keys(result.answers || {}).length
            }`,
            icon: <CheckIcon color={colors.contrast} />,
          },
        ]}
      />
    </View>
  );
};

interface UseLibraryListRendererProps {
  entityName: EntityType;
  related_entities: any[];
}

export const useLibraryListRenderer = ({
  entityName,
  related_entities,
}: UseLibraryListRendererProps) => {
  const renderItem = (props: { item: any }) => {
    if (entityName === ENTITY_NAME.JOURNAL_ENTRIES) {
      return (
        <JournalEntryItem
          item={props.item}
          entityName={entityName}
          related_entities={related_entities}
        />
      );
    } else if (entityName === ENTITY_NAME.TEST_RESULTS) {
      return <TestResultItem item={props.item} entityName={entityName} />;
    }
    return null;
  };

  return { renderItem };
};
