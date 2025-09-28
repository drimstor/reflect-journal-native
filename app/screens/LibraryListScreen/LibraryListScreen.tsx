import { BOTTOM_SHEET_SCREEN_POINTS, PATHS } from "@/src/shared/const";
import {
  ENTITY_NAME,
  ENTITY_WITH_CHILDREN_CONFIG,
} from "@/src/shared/const/ENTITIES";
import { useT } from "@/src/shared/lib/hooks";
import { StackNavigationProps } from "@/src/shared/model/types";
import {
  getFiltersParams,
  isAnyFilterActive,
  useBottomSheetStore,
  useFiltersStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  AnimatedAppearance,
  BottomSheet,
  BottomSheetStaticBackdrop,
  Button,
  Divider,
  Layout,
  VirtualizedList,
  useBottomSheetActions,
} from "@/src/shared/ui";
import { DotsIcon } from "@/src/shared/ui/icons";
import { FiltersPanel, Header } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import { useLibraryListData } from "./lib/hooks/useLibraryListData";
import { useLibraryListRenderer } from "./lib/hooks/useLibraryListRenderer";
import { createStyles } from "./LibraryListScreen.styles";

const LibraryListScreen = () => {
  const t = useT();
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProps>();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const filters = useFiltersStore();
  const { setNavigation } = useBottomSheetStore();
  const { setScreenInfo } = useScreenInfoStore();
  const { variant, item } = route.params as any;
  const { handlePress } = useBottomSheetActions(variant, item);

  const { LARGE } = BOTTOM_SHEET_SCREEN_POINTS;
  const snapPoints = useMemo(() => [LARGE], [LARGE]);

  const title = item?.name;
  const related_entities = item?.related_entities ?? [];
  const entityName = ENTITY_WITH_CHILDREN_CONFIG?.[variant]; // children entity

  useEffect(() => {
    filters.resetFilters();
    // Для этого экрана нужна динамическая установка screenInfo на основе entityName
    // так как название экрана зависит от параметров маршрута
    setScreenInfo({ name: entityName });

    return filters.resetFilters;
  }, []);

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  const ENTITY_ID_CONFIG = {
    [ENTITY_NAME.JOURNAL_ENTRIES]: "journal_id",
    [ENTITY_NAME.TEST_RESULTS]: "test_id",
  };

  const params = getFiltersParams({
    [ENTITY_ID_CONFIG?.[entityName]]: item?.id,
    ...filters,
  });

  // Используем новый универсальный хук для получения данных
  const { data, isFetching, isLoading } = useLibraryListData({
    entityName,
    params,
  });

  console.log("useLibraryListData", data);

  // Используем новый универсальный рендерер
  const { renderItem } = useLibraryListRenderer({
    entityName,
    related_entities,
  });

  const isTest = variant === ENTITY_NAME.TESTS;

  const isTestAndFinishedLoading =
    isTest && !isLoading && data?.data && Array.isArray(data?.data);

  const isTestAndNoResults =
    isTestAndFinishedLoading && !data?.data?.length && !data?.totalItems;
  const isTestAndHasResults = isTestAndFinishedLoading && !!data?.data?.length;

  // Поменять условие // Автоматический редирект для тестов если результатов нет
  useEffect(() => {
    if (isTestAndNoResults && !isAnyFilterActive(filters)) {
      // Если результатов тестов нет, заменяем текущий экран на экран элемента библиотеки
      navigation.replace(PATHS.LIBRARY_ITEM, { variant, item });
    }
  }, [isTestAndNoResults, variant, item]);

  return (
    <Layout>
      <Header
        backButton
        title={isTest && isLoading ? t("library.title") : title}
        subtitle={
          isTest && isLoading ? "" : t(`library.${variant.toLowerCase()}.list`)
        }
        rightIcon={
          isTest && !filters.multi_select_ids?.length
            ? undefined
            : {
                icon: <DotsIcon color={colors.contrast} size={22} />,
                onPress: handlePress,
              }
        }
      />
      <BottomSheetStaticBackdrop />
      <BottomSheet
        snapPoints={snapPoints}
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
          isInitialVisible
          delay={200}
          style={
            isTestAndHasResults
              ? { maxHeight: WINDOW_HEIGHT - 160, paddingBottom: 100 }
              : {}
          }
        >
          <VirtualizedList
            data={data as any}
            renderItem={renderItem}
            isFetching={isLoading}
            sortField="created_at"
            entityName={entityName}
          />
        </AnimatedAppearance>

        {isTestAndHasResults && (
          <View
            style={{
              position: "absolute",
              bottom: 100,
              width: "100%",
              backgroundColor: colors.secondary,
            }}
          >
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
            <Button
              onPress={() => {
                navigation.navigate(PATHS.LIBRARY_ITEM, { variant, item });
              }}
              style={{ marginTop: 20, marginBottom: 20 }}
              size="medium"
            >
              {t("test.takeAgain")}
            </Button>
          </View>
        )}
      </BottomSheet>
    </Layout>
  );
};

export default LibraryListScreen;
