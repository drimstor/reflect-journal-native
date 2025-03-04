import { groupByDate } from "@/src/shared/lib/helpers";
import React, { useEffect, useMemo } from "react";
import { Chip, Loader, NoData } from "@/src/shared/ui";
import {
  useDeviceStore,
  useThemeStore,
  useFiltersStore,
} from "@/src/shared/store";
import { Divider } from "@/src/shared/ui";
import { styles } from "./VirtualizedList.styles";
import { View, LogBox } from "react-native";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { VirtualizedListProps, WithDateAndId } from "./model/types";
import { useLang } from "@/src/shared/lib/hooks";

function VirtualizedList<ItemT extends WithDateAndId>({
  renderItem,
  data,
  isFetching,
}: VirtualizedListProps<ItemT>) {
  const { window } = useDeviceStore();
  const { colors } = useThemeStore();
  const { locale } = useLang();
  const { setPage } = useFiltersStore();

  const loadMore = () => {
    if (data && data.currentPage < data.totalPages && !isFetching) {
      setPage(data.currentPage + 1);
    }
  };

  const sections = useMemo(() => {
    if (!data?.data) return [];
    return groupByDate<ItemT>(data.data, locale);
  }, [data?.data, locale]);

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
      ListEmptyComponent={() =>
        !isFetching && (
          <NoData
            style={{ marginTop: 25 }}
            type="noData"
            onPress={() => {
              // Здесь можно добавить обработчик для создания нового элемента
            }}
          />
        )
      }
      ListFooterComponent={() => (
        <Loader
          style={{ marginTop: 25 }}
          size={window.width - 150}
          isVisible={isFetching}
        />
      )}
    />
  );
}

export default VirtualizedList;
