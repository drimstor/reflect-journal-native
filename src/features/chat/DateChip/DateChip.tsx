import { FC } from "react";
import { Animated } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { Chip } from "@/src/shared/ui";
import { createStyles } from "./DateChip.styles";

interface DateChipProps {
  date: Date;
  animation: Animated.Value;
}

const DateChip: FC<DateChipProps> = ({ date, animation }) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors, animation);

  return (
    <Animated.View style={[styles.container]}>
      <Chip
        size="base"
        color={colors.secondary}
        borderColor={colors.alternate}
        title={date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        })}
      />
    </Animated.View>
  );
};

export default DateChip;
