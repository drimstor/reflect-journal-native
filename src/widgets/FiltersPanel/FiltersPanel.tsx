import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./FiltersPanel.styles";
import { IconButton } from "@/src/shared/ui";
import {
  BookmarkCheckIcon,
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

interface FiltersPanelProps {
  style?: StyleProp<ViewStyle>;
}

const FiltersPanel = ({ style }: FiltersPanelProps) => {
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const { setBottomSheetVisible, navigateToFlow, setFlowData } =
    useBottomSheetStore();
  const {
    sort_field,
    bookmarked,
    setBookmarked,
    ai_response,
    is_completed,
    related_topics,
    multi_select,
    setMultiSelect,
    created_at_from,
    updated_at_from,
  } = useFiltersStore();

  const buttonsCofig = [
    {
      icon: <CalendarIcon color={colors.contrast} variant="outlined" />,
      isActive: created_at_from || updated_at_from,
      onPress: () => {
        navigateToFlow("date", "list");
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
        setFlowData({ sortVariant: "Entities" });
        setTimeout(() => {
          setBottomSheetVisible(true);
        }, 150);
      },
    },
    {
      icon: <FilterIcon color={colors.contrast} />,
      isActive: ai_response || is_completed || related_topics,
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
      icon: <BookmarkCheckIcon color={colors.contrast} />,
      isActive: bookmarked,
      onPress: () => {
        setBookmarked(bookmarked ? undefined : true);
      },
    },
  ];

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

export default FiltersPanel;
