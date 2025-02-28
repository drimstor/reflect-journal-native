import { groupByDate } from "@/src/shared/lib/helpers";
import React, { useEffect, useMemo } from "react";
import { Chip } from "@/src/shared/ui";
import {
  useDeviceStore,
  useThemeStore,
  useFiltersStore,
} from "@/src/shared/store";
import { Divider } from "@/src/shared/ui";
import { styles } from "./VirtualizedList.styles";
import { View, ActivityIndicator, LogBox } from "react-native";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { VirtualizedListProps, WithDateAndId } from "./model/types";

function VirtualizedList<ItemT extends WithDateAndId>({
  renderItem,
  data,
  isFetching,
}: VirtualizedListProps<ItemT>) {
  const { window } = useDeviceStore();
  const { colors } = useThemeStore();
  const { setPage } = useFiltersStore();

  const loadMore = () => {
    if (data && data.currentPage < data.totalPages && !isFetching) {
      setPage(data.currentPage + 1);
    }
  };

  const sections = useMemo(() => {
    if (!data?.data) return [];
    return groupByDate<ItemT>(data.data);
  }, [data?.data]);

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.dateChip}>
      <Chip
        size="base"
        color={colors.secondary}
        borderColor={colors.alternate}
        title={title}
      />
    </View>
  );

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
      ListFooterComponent={() =>
        isFetching ? (
          <ActivityIndicator color={colors.contrast} style={styles.loader} />
        ) : null
      }
    />
  );
}

export default VirtualizedList;
