import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./FiltersPanel.styles";
import { IconButton } from "@/src/shared/ui";
import {
  BookmarkCheckIcon,
  CalendarIcon,
  CheckListIcon,
  FilterIcon,
  SearchIcon,
  SortIcon,
} from "@/src/shared/ui/icons";
import { useThemeStore } from "@/src/shared/store";
import { useMemo } from "react";

interface FiltersPanelProps {
  style?: StyleProp<ViewStyle>;
}

const FiltersPanel = ({ style }: FiltersPanelProps) => {
  const { colors, theme } = useThemeStore();

  const backgroundColor = useMemo(
    () => (theme === "light" ? colors.light : colors.contrastReverse),
    [theme]
  );

  return (
    <View style={[styles.globalBox, style]}>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <SearchIcon color={colors.contrast} />
      </IconButton>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <CalendarIcon color={colors.contrast} variant="outlined" />
      </IconButton>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <SortIcon color={colors.contrast} />
      </IconButton>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <FilterIcon color={colors.contrast} />
      </IconButton>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <CheckListIcon color={colors.contrast} />
      </IconButton>
      <IconButton style={{ backgroundColor }} onPress={() => {}}>
        <BookmarkCheckIcon color={colors.contrast} />
      </IconButton>
    </View>
  );
};

export default FiltersPanel;
