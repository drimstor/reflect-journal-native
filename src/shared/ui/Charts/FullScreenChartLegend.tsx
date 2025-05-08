import { ListItemPreview } from "@/src/features";
import { FC } from "react";
import { View } from "react-native";
import { useThemeStore } from "../../store";
import { stringToColor } from "../../lib/helpers";
import { PortraitNode } from "@/src/entities";
import { useT } from "@/src/shared/lib/hooks";

interface FullScreenChartLegendProps {
  data: PortraitNode[];
  onPress: (item: PortraitNode) => void;
}

const FullScreenChartLegend: FC<FullScreenChartLegendProps> = ({
  data,
  onPress,
}) => {
  const { colors } = useThemeStore();
  const t = useT();

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
          onPress={() => onPress(item)}
          onDotsPress={() => {}}
        />
      ))}
    </View>
  );
};

export default FullScreenChartLegend;
