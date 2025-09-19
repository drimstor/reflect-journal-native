import { FiltersSearch } from "@/src/features";
import {
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import { IconButton } from "@/src/shared/ui";
import {
  BookmarkCheckIcon,
  CalendarIcon,
  CheckListIcon,
  FilterIcon,
  SortIcon,
} from "@/src/shared/ui/icons";
import { useMemo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { ENTITY_NAME } from "../../shared/const/ENTITIES";
import { styles } from "./FiltersPanel.styles";

interface FiltersPanelProps {
  style?: StyleProp<ViewStyle>;
}

const FiltersPanel = ({ style }: FiltersPanelProps) => {
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const { setBottomSheetVisible, navigateToFlow, setFlowData } =
    useBottomSheetStore();
  const { screenInfo } = useScreenInfoStore();
  const isTest = screenInfo?.name === ENTITY_NAME.TESTS;
  const isTestResult = screenInfo?.name === ENTITY_NAME.TEST_RESULTS;

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
        if (isTest || isTestResult) {
          navigateToFlow("date", "pickerPeriod");

          setFlowData({
            sort_field: "created_at",
            isWithoutHeaderControls: true,
          });

          requestAnimationFrame(() => {
            setBottomSheetVisible(true);
          });
        } else {
          navigateToFlow("date", "list");
          requestAnimationFrame(() => {
            setBottomSheetVisible(true);
          });
        }
      },
    },
    {
      icon: <SortIcon color={colors.contrast} />,
      isActive: sort_field,
      onPress: () => {
        navigateToFlow("sort", "list");
        setFlowData({ sortVariant: "Entities" });
        requestAnimationFrame(() => {
          setBottomSheetVisible(true);
        });
      },
    },
    {
      icon: <FilterIcon color={colors.contrast} />,
      isActive: ai_response || is_completed || related_topics,
      onPress: () => {
        navigateToFlow("filter", "list");
        requestAnimationFrame(() => {
          setBottomSheetVisible(true);
        });
      },
    },
    {
      icon: <CheckListIcon color={colors.contrast} />,
      isActive: multi_select,
      onPress: () => {
        if (isTest) return;
        setMultiSelect(multi_select ? false : true);
      },
    },
    {
      icon: <BookmarkCheckIcon color={colors.contrast} />,
      isActive: bookmarked,
      onPress: () => {
        if (isTest) return;
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
