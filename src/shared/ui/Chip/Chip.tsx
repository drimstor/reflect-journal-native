import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";
import { Info, Text } from "@/src/shared/ui";
import { FC } from "react";
import { View } from "react-native";
import { capitalizeText } from "../../lib/helpers";
import { styles } from "./Chip.styles";

interface ChipProps {
  color: string;
  title: string;
  textColor?: string;
  borderColor?: string;
  size?: "small" | "medium" | "base";
  tooltipText?: string;
}

const Chip: FC<ChipProps> = ({
  color = "red",
  title = "test",
  textColor,
  borderColor,
  size = "medium",
  tooltipText,
}) => {
  const contrastTextColor = getContrastColor(color);
  return (
    <View
      style={[
        styles.chip,
        size && styles[size],
        { backgroundColor: color },
        borderColor ? { borderColor, borderWidth: 1 } : {},
      ]}
    >
      <Text size={size} color={textColor || contrastTextColor}>
        {capitalizeText(title)}
      </Text>
      {tooltipText && (
        <View style={styles.infoBox}>
          <Info
            tooltipText={tooltipText}
            iconColor={textColor || contrastTextColor}
          />
        </View>
      )}
    </View>
  );
};

export default Chip;
