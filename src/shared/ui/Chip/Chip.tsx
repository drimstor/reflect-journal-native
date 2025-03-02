import { FC } from "react";
import { View } from "react-native";
import { styles } from "./Chip.styles";
import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";
import { Text } from "@/src/shared/ui";

interface ChipProps {
  color: string;
  title: string;
  textColor?: string;
  borderColor?: string;
  size?: "small" | "medium" | "base";
}

const Chip: FC<ChipProps> = ({
  color,
  title,
  textColor,
  borderColor,
  size = "medium",
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
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </Text>
    </View>
  );
};

export default Chip;
