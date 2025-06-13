import { useEffect } from "react";
import { FiltersPanel, Header } from "@/src/widgets";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { View } from "react-native";
import { CalendarIcon, DotsIcon } from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryListScreen.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { PATHS } from "@/src/shared/const";
import {
  JournalEntry,
  useGetJournalEntriesQuery,
  useMultiSelection,
} from "@/src/entities";
import { PreviewBlock } from "@/src/features";
import { formatDate } from "@/src/shared/lib/helpers";
import {
  getFiltersParams,
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  Divider,
  Layout,
  BottomSheet,
  VirtualizedList,
  useBottomSheetActions,
  CheckBox,
  AnimatedAppearance,
} from "@/src/shared/ui";
import {
  ENTITY_NAME,
  ENTITY_WITH_CHILDREN_CONFIG,
} from "@/src/shared/const/ENTITIES";

const LibraryListScreen = () => {
  const t = useT();
  const route = useRoute();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const filters = useFiltersStore();
  const { setNavigation } = useBottomSheetStore();
  const { setScreenInfo } = useScreenInfoStore();
  const { variant, item } = route.params as any;
  const { handlePress } = useBottomSheetActions(variant, item);

  const title = item?.name;
  const related_entities = item?.related_entities ?? [];
  const entityName = ENTITY_WITH_CHILDREN_CONFIG?.[variant];

  useEffect(() => {
    filters.resetFilters();
    setScreenInfo({ name: entityName });
  }, []);

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  const ENTITY_ID_CONFIG = {
    [ENTITY_NAME.JOURNAL_ENTRY]: "journal_id",
  };
  const params = getFiltersParams({
    [ENTITY_ID_CONFIG?.[entityName]]: item?.id,
    ...filters,
  });

  const { data, isFetching } = useGetJournalEntriesQuery({ params });

  const renderItem = ({ item }: { item: JournalEntry }) => {
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
        backgroundColor={colors.light}
        backgroundColorForAnimate={colors.alternate}
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
        ]}
      />
    );
  };

  return (
    <Layout>
      <Header
        backButton
        title={title}
        subtitle={t(`library.${variant.toLowerCase()}.entriesList`)}
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
        pinnedElement={
          <View style={{ paddingTop: 25 }}>
            <FiltersPanel style={styles.filtersPanel} />
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <AnimatedAppearance
          isVisible
          delay={150}
          // style={{ maxHeight: window.height - 160, paddingBottom: 100 }}
        >
          <VirtualizedList
            data={data as any}
            renderItem={renderItem}
            isFetching={isFetching}
            sortField="created_at"
          />
        </AnimatedAppearance>

        {/* <View
          style={{
            position: "absolute",
            bottom: 100,
            width: "100%",
            backgroundColor: colors.secondary,
          }}
        >
          <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          <Button
            onPress={() => filters.resetFilters()}
            style={{ marginTop: 20, marginBottom: 20 }}
            size="medium"
          >
            Clear filters
          </Button>
        </View> */}
      </BottomSheet>
    </Layout>
  );
};

export default LibraryListScreen;
