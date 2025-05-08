import {
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
  List,
  CheckIcon,
  BottomSheetScrollView,
} from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useFilterLogic } from "./lib/hooks/useFilterLogic";
import FilterInput from "./ui/FilterInput";

const FilterEntityView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  const {
    submitFilter,
    actions,
    handleReset,
    activeFilter,
    setActiveFilter,
    inputValues,
    setInputValue,
    isFiltered,
  } = useFilterLogic();

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("filter.filterBy")} />
      <BottomSheetScrollView>
        <PaddingLayout>
          <List
            listItemVariant="reverse"
            style={{ marginVertical: -10 }}
            items={actions.map(
              ({ text, IconComponent, iconSize, key, type, placeholder }) => ({
                text,
                element:
                  type === "buttonInput"
                    ? activeFilter.includes(key) && (
                        <FilterInput
                          value={inputValues[key] || ""}
                          onChangeText={(value) => setInputValue(key, value)}
                          placeholder={placeholder}
                        />
                      )
                    : activeFilter.includes(key) && (
                        <CheckIcon color={colors.contrast} size={22} />
                      ),
                onPress: () => {
                  setActiveFilter(
                    activeFilter.includes(key)
                      ? activeFilter.filter((filter) => filter !== key)
                      : [...activeFilter, key]
                  );
                },
                IconComponent: (props) => (
                  <IconComponent
                    {...props}
                    color={props.color}
                    size={iconSize || props.size}
                  />
                ),
              })
            )}
          />
        </PaddingLayout>
        <BottomSheetFooter>
          <Button
            backgroundColor={colors.alternate}
            onPress={handleReset}
            disabled={!isFiltered}
          >
            {t("shared.actions.reset")}
          </Button>

          <Button
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            onPress={submitFilter}
            isLoading={false}
          >
            {t("shared.actions.apply")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetScrollView>
    </BottomSheetBox>
  );
};

export default FilterEntityView;
