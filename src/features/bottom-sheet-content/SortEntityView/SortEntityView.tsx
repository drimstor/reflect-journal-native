import {
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
  List,
} from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useSortLogic } from "./lib/hooks/useSortLogic";
import SortDirectionIndicator from "./ui/SortDirectionIndicator";

const SortEntityView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  const {
    activeSort,
    sortDirection,
    setActiveSort,
    toggleSortDirection,
    submitSort,
    actions,
    handleReset,
    isCleared,
  } = useSortLogic();

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("sort.sortBy")} />
      <PaddingLayout>
        <List
          listItemVariant="reverse"
          style={{ marginVertical: -10 }}
          items={actions.map(({ text, IconComponent, iconSize, key }) => ({
            text,
            onPress: () => {
              setActiveSort(key as any);
              toggleSortDirection();
            },
            IconComponent: (props) => (
              <IconComponent
                {...props}
                color={props.color}
                size={iconSize || props.size}
              />
            ),
            element: activeSort === key && (
              <SortDirectionIndicator
                sortKey={key}
                sortDirection={sortDirection}
              />
            ),
          }))}
        />
      </PaddingLayout>
      <BottomSheetFooter>
        <Button
          backgroundColor={colors.alternate}
          onPress={handleReset}
          disabled={isCleared}
        >
          {t("shared.actions.reset")}
        </Button>

        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          onPress={submitSort}
          isLoading={false}
        >
          {t("shared.actions.apply")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default SortEntityView;
