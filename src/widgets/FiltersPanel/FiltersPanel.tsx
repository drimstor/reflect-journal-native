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
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { useMemo } from "react";
import { FiltersSearch } from "@/src/features";

interface FiltersPanelProps {
  style?: StyleProp<ViewStyle>;
}

const FiltersPanel = ({ style }: FiltersPanelProps) => {
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();

  const backgroundColor = useMemo(
    () => (theme === "light" ? colors.light : colors.contrastReverse),
    [theme]
  );

  const buttonsCofig = [
    {
      icon: <CalendarIcon color={colors.contrast} variant="outlined" />,
      onPress: () => {},
    },
    {
      icon: <SortIcon color={colors.contrast} />,
      onPress: () => {},
    },
    {
      icon: <FilterIcon color={colors.contrast} />,
      onPress: () => {},
    },
    {
      icon: <CheckListIcon color={colors.contrast} />,
      onPress: () => {},
    },
    {
      icon: <BookmarkCheckIcon color={colors.contrast} />,
      onPress: () => {},
    },
  ];

  const gap =
    (window.width - 24 * 2 - (buttonsCofig.length + 1) * 55) /
    buttonsCofig.length;

  return (
    <View style={[styles.globalBox, style, { gap }]}>
      <FiltersSearch />
      {buttonsCofig.map((button, index) => (
        <IconButton
          style={{ backgroundColor }}
          onPress={button.onPress}
          isAnimated
          key={index}
        >
          {button.icon}
        </IconButton>
      ))}
    </View>
  );
};

export default FiltersPanel;
