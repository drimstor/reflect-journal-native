import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./FiltersPanel.styles";
import { IconButton } from "@/src/shared/ui";
import {
  CalendarIcon,
  CheckListIcon,
  FilterIcon,
  SortIcon,
} from "@/src/shared/ui/icons";
import {
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import { useEffect, useMemo } from "react";
import { FiltersSearch } from "@/src/features";
import { Text } from "@/src/shared/ui";

interface FiltersPanelProps {
  style?: StyleProp<ViewStyle>;
}

const ChartsFiltersPanel = ({ style }: FiltersPanelProps) => {
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const { setBottomSheetVisible, navigateToFlow, setFlowData } =
    useBottomSheetStore();

  const {
    sort_field,
    related_topics,
    multi_select,
    setMultiSelect,
    updated_at_from,
    limit,
    setLimit,
    category,
    resetFilters,
  } = useFiltersStore();

  const limitValues = [10, 25, 50, 100];

  const buttonsCofig = [
    {
      icon: <CalendarIcon color={colors.contrast} variant="outlined" />,
      isActive: updated_at_from,
      onPress: () => {
        navigateToFlow("date", "pickerPeriod");

        setFlowData({
          sort_field: "updated_at",
          isWithoutHeaderControls: true,
        });

        setTimeout(() => {
          setBottomSheetVisible(true);
        }, 150);
      },
    },
    {
      icon: <SortIcon color={colors.contrast} />,
      isActive: sort_field,
      onPress: () => {
        navigateToFlow("sort", "list");

        setTimeout(() => {
          setBottomSheetVisible(true);
        }, 150);
      },
    },
    {
      icon: <FilterIcon color={colors.contrast} />,
      isActive: related_topics || category,
      onPress: () => {
        navigateToFlow("filter", "list");

        setTimeout(() => {
          setBottomSheetVisible(true);
        }, 150);
      },
    },
    {
      icon: <CheckListIcon color={colors.contrast} />,
      isActive: multi_select,
      onPress: () => {
        setMultiSelect(multi_select ? false : true);
      },
    },
    {
      icon: (
        <Text
          font="bold"
          size="extraLarge"
          color={colors.contrast}
          style={{ lineHeight: 23 }}
        >
          {limit}
        </Text>
      ),
      onPress: () => {
        const newLimit =
          limitValues[(limitValues.indexOf(limit) + 1) % limitValues.length];
        setLimit(newLimit);
      },
    },
  ];

  useEffect(() => {
    resetFilters();
    return resetFilters;
  }, []);

  const gap =
    (window.width - 24 * 2 - (buttonsCofig.length + 1) * 55) /
    buttonsCofig.length;

  const backgroundColor = useMemo(
    () => (theme === "light" ? colors.light : colors.contrastReverse),
    [theme]
  );

  return (
    <View style={[styles.globalBox, style, { gap }]}>
      <FiltersSearch />
      {buttonsCofig.map((button, index) => (
        <IconButton
          style={{ backgroundColor }}
          onPress={button.onPress}
          key={index}
          isActive={!!button.isActive}
          isAnimated
        >
          {button.icon}
        </IconButton>
      ))}
    </View>
  );
};

export default ChartsFiltersPanel;
