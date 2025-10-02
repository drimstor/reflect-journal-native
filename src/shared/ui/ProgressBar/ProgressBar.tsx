import { useThemeStore } from "@/src/shared/store";
import { FC } from "react";
import { View } from "react-native";
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
  const { colors, theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor:
            backgroundColor || theme === "light" ? colors.alternate : "#393841",
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
