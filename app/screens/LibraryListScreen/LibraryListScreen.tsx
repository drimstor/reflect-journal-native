import { FC, useEffect } from "react";
import { FiltersPanel, Header } from "@/src/widgets";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { View } from "react-native";
import {
  CalendarIcon,
  DotsIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryListScreen.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { PATHS } from "@/src/shared/const";
import { JournalEntry, useGetJournalEntriesQuery } from "@/src/entities";
import { PreviewBlock } from "@/src/features";
import { formatDate, stringToColor } from "@/src/shared/lib/helpers";
import {
  getFiltersParams,
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  Divider,
  Layout,
  Chip,
  BottomSheet,
  VirtualizedList,
  NoSearchDataImg,
  useBottomSheetActions,
} from "@/src/shared/ui";

interface LibraryListScreenProps {}

const LibraryListScreen: FC<LibraryListScreenProps> = () => {
  const t = useT();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const filters = useFiltersStore();
  const { setNavigation } = useBottomSheetStore();

  const route = useRoute();
  const { variant, item } = route.params as any;

  const title = item?.name;
  const related_entities = item?.related_entities ?? [];

  useEffect(() => {
    filters.resetFilters();
  }, []);

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  const params = getFiltersParams({ ...filters, journal_id: item?.id });

  const { data, isLoading, isFetching } = useGetJournalEntriesQuery({ params });

  const renderItem = ({ item }: { item: JournalEntry }) => {
    const journal = item as JournalEntry;

    return (
      <PreviewBlock
        key={journal.id}
        value={journal.content}
        backgroundColor={colors.light}
        backgroundColorForAnimate={colors.alternate}
        tags={journal.related_topics}
        bookmarked={journal.bookmarked}
        previewMode
        element={
          journal.related_topics[0] && (
            <Chip
              color={stringToColor(journal.related_topics[0])}
              title={journal.related_topics[0]}
            />
          )
        }
        onPress={() =>
          navigation.navigate(PATHS.LIBRARY_ITEM, {
            variant: "JournalEntries",
            item: { ...item, related_entities },
          })
        }
        infoBoxes={[
          {
            label: t("shared.info.created"),
            value: formatDate(journal.created_at, locale),
            icon: <CalendarIcon variant="outlined" color={colors.contrast} />,
          },
        ]}
      />
    );
  };

  const { handlePress } = useBottomSheetActions(variant, item);

  return (
    <Layout>
      <Header
        backButton
        title={title}
        subtitle={t("library.journals.entriesList")}
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} size={22} />,
          onPress: handlePress,
        }}
      />
      <BottomSheet
        snapPoints={[window.height - 85]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        initialIndex={0}
        staticMode
        topElement={<View style={{ height: 41 }} />}
        pinnedElement={
          <View>
            <FiltersPanel style={styles.filtersPanel} />
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <VirtualizedList
          data={data as any}
          renderItem={renderItem}
          isFetching={isFetching}
        />
      </BottomSheet>
    </Layout>
  );
};

export default LibraryListScreen;
