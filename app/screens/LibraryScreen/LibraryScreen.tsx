import { View } from "react-native";
import {
  Layout,
  Carousel,
  BottomSheet,
  Chip,
  useCarouselConfig,
  Divider,
} from "@/src/shared/ui";
import { PreviewCard } from "@/src/features";
import { FiltersPanel, Header, LibraryList } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore, useFiltersStore } from "@/src/shared/store";
import { CpuIcon, DotsIcon } from "@/src/shared/ui/icons";
import { styles } from "./LibraryScreen.styles";
import { useLibraryScreenLogic } from "./lib/hooks/useLibraryScreenLogic";
import { LIBRARY_ITEMS } from "./const/static";
import { EntityType } from "@/src/shared/model/types";
import { useLibraryBottomSheet } from "./lib/hooks/useLibraryBottomSheet";
import { useMultiSelectActions } from "./lib/hooks/useMultiSelectActions";

const LibraryScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { multi_select_ids } = useFiltersStore();

  const { bottomSheetRef, snapToIndex, snapPoints, bottomSheetIndex } =
    useLibraryBottomSheet();
  const { currentIndex, setCurrentIndex, onOpenListItem } =
    useLibraryScreenLogic({ snapToIndex, bottomSheetIndex });
  const { handleMultiSelectActions, toggleStatusBar } = useMultiSelectActions();

  // Получаем данные для текущего выбранного элемента
  const currentItem = LIBRARY_ITEMS[currentIndex];
  const currentColor = colors[currentItem.colorKey as keyof typeof colors];
  const currentVariant = currentItem.id as EntityType;

  return (
    <Layout>
      <Header
        title={t("library.title")}
        leftIcon={{
          icon: <CpuIcon color={colors.contrast} size={22} />,
          onPress: toggleStatusBar,
        }}
        rightIcon={
          multi_select_ids?.length
            ? {
                icon: <DotsIcon color={colors.contrast} size={22} />,
                onPress: handleMultiSelectActions,
              }
            : undefined
        }
      />
      <Carousel
        height={100}
        style={styles.carousel}
        mode="parallax"
        handler={setCurrentIndex}
        modeConfig={useCarouselConfig(50, 140)}
        renderItem={({ item }) => (
          <PreviewCard
            backgroundColor={item.backgroundColor}
            title={item.title}
            subTitle={item.subTitle}
            icon={item.icon}
          />
        )}
        data={LIBRARY_ITEMS.map((item) => ({
          title: t(`entities.${item.id.toLowerCase()}.plural`),
          subTitle: t(`library.${item.id.toLowerCase()}.description`),
          backgroundColor: colors[item.colorKey as keyof typeof colors],
          icon: item.getIcon(colors.black, 40),
        }))}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        scrollEnabled={false}
        onChange={snapToIndex}
        topElement={
          <View style={styles.chipBox}>
            <Chip
              size="small"
              color={currentColor}
              title={t(`entities.${currentVariant.toLowerCase()}.plural`)}
            />
          </View>
        }
        pinnedElement={
          <View>
            <FiltersPanel style={styles.filtersPanel} />
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <LibraryList
          onPress={onOpenListItem}
          variant={currentVariant as Exclude<EntityType, "JournalEntries">}
        />
      </BottomSheet>
    </Layout>
  );
};

export default LibraryScreen;
