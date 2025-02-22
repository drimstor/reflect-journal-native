import { FC } from "react";
import { View } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { styles } from "./ProgressBar.styles";

interface ProgressBarProps {
  progress: number; // от 0 до 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  height = 4,
  backgroundColor,
  progressColor,
}) => {
  const { colors } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor || colors.alternate,
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: progressColor || colors.accent,
          },
        ]}
      />
    </View>
  );
};

export default ProgressBar;
