import { groupByDate } from "@/src/shared/lib/helpers";
import { useLang } from "@/src/shared/lib/hooks";
import {
  isAnyFilterActive,
  useDeviceStore,
  useFiltersStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  AnimatedAppearance,
  Chip,
  Divider,
  Loader,
  NoData,
} from "@/src/shared/ui";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo } from "react";
import { LogBox, View } from "react-native";
import { PATHS } from "../../const/PATHS";
import { NavigationProps } from "../../model/types";
import { VirtualizedListProps, WithDateAndId } from "./model/types";
import { styles } from "./VirtualizedList.styles";

export const SectionHeader = ({ title }: { title: string }) => {
  const { colors } = useThemeStore();
  return (
    <View style={styles.dateChip}>
      <Chip
        size="base"
        color={colors.secondary}
        borderColor={colors.alternate}
        title={title}
      />
    </View>
  );
};

export const renderSectionHeader = ({
  section: { title },
}: {
  section: { title: string };
}) => <SectionHeader title={title} />;

function VirtualizedList<ItemT extends WithDateAndId>({
  renderItem,
  data,
  isFetching,
  sortField = "updated_at",
  entityName,
}: VirtualizedListProps<ItemT>) {
  const { window } = useDeviceStore();
  const { colors } = useThemeStore();
  const { locale } = useLang();
  const filters = useFiltersStore();
  const { setNavigationScreenInfo } = useScreenInfoStore();
  const isFilterActive = isAnyFilterActive(filters);
  const navigation = useNavigation<NavigationProps>();
  const loadMore = () => {
    if (data && data.currentPage < data.totalPages && !isFetching) {
      filters.setPage(data.currentPage + 1);
    }
  };

  const sections = useMemo(() => {
    if (!data?.data) return [];
    return groupByDate<ItemT>(data.data, locale, sortField);
  }, [data?.data, locale, sortField]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, [data]);

  return (
    <BottomSheetSectionList
      scrollEnabled
      sections={sections}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      renderSectionHeader={renderSectionHeader}
      onEndReached={loadMore}
      onEndReachedThreshold={0.7}
      keyExtractor={(item, index) => item.id + index}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={[{ maxHeight: window.height - 160 }, styles.globalBox]}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: window.height - 175 },
      ]}
      SectionSeparatorComponent={({ leadingItem, trailingSection }) =>
        leadingItem &&
        trailingSection && (
          <Divider style={styles.divider} color={colors.alternate} />
        )
      }
      ListEmptyComponent={() =>
        !isFetching && (
          <NoData
            style={{ marginTop: 25 }}
            type={isFilterActive ? "noSearch" : "noData"}
            onPress={() => {
              if (isFilterActive) {
                filters.resetFilters();
              } else {
                setNavigationScreenInfo({ name: entityName });
                navigation.navigate(PATHS.ADD_ENTRY);
              }
            }}
          />
        )
      }
      ListFooterComponent={() => (
        <AnimatedAppearance isVisible>
          <Loader
            style={{ marginTop: 25 }}
            size={window.width - 100}
            isVisible={isFetching}
          />
        </AnimatedAppearance>
      )}
    />
  );
}

export default VirtualizedList;
