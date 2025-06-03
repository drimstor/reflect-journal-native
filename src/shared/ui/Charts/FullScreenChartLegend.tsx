import { ListItemPreview } from "@/src/features";
import { FC } from "react";
import { View } from "react-native";
import { useFiltersStore, useThemeStore } from "../../store";
import { stringToColor } from "../../lib/helpers";
import { PortraitNode } from "@/src/entities";
import { useT } from "@/src/shared/lib/hooks";
import { DotsIcon } from "@/src/shared/ui/icons";
import { CheckBox } from "..";

interface FullScreenChartLegendProps {
  data: PortraitNode[];
  onPress?: (item: PortraitNode) => void;
  isSelectMode?: boolean;
}

const FullScreenChartLegend: FC<FullScreenChartLegendProps> = ({
  data,
  onPress,
  isSelectMode,
}) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { multi_select_ids, setMultiSelectIds, multi_select } =
    useFiltersStore();

  const onPressSelectItem = (name: string) => {
    if (multi_select_ids?.includes(name)) {
      setMultiSelectIds(multi_select_ids?.filter((id) => id !== name));
    } else {
      setMultiSelectIds([...(multi_select_ids || []), name]);
    }
  };

  return (
    <View
      style={{
        marginTop: 12,
        gap: 12,
        minWidth: "100%",
      }}
    >
      {data.map((item, index) => (
        <ListItemPreview
          key={`legend-item-${index}`}
          title={item.name}
          subTitle={`${item.count} ${t("shared.charts.mentions")}`}
          customComponent={
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: stringToColor(item.name),
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          }
          backgroundColor={colors.light}
          backgroundColorForAnimate={colors.alternate}
          onPress={() => {
            if (isSelectMode || multi_select) {
              onPressSelectItem(item.name);
            } else {
              onPress?.(item);
            }
          }}
          element={
            isSelectMode || multi_select ? (
              <CheckBox
                checked={!!multi_select_ids?.includes(item.name)}
                onPress={() => onPressSelectItem(item.name)}
                checkedColor={colors.accent}
              />
            ) : (
              <DotsIcon color={colors.contrast} size={24} />
            )
          }
        />
      ))}
    </View>
  );
};

export default FullScreenChartLegend;
