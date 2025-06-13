import { createStyles } from "./GradientAffirmation.styles";
import { Text } from "@/src/shared/ui";
import { ThemeColors } from "@/src/shared/model/types";
import { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "@/src/shared/store";

interface GradientAffirmationProps {
  colors: ThemeColors;
  value: string;
  element?: ReactNode;
  icon?: ReactNode;
}

const GradientAffirmation = ({
  colors,
  value,
  icon,
}: GradientAffirmationProps) => {
  const { theme } = useThemeStore();
  const styles = createStyles(colors);

  const gradientColors = {
    dark: [colors.purple, colors.blue] as const,
    light: ["#9cfd91", "#47cbff"] as const,
  };

  return (
    <LinearGradient
      colors={gradientColors[theme]}
      start={{ x: 0.1, y: 0.7 }}
      end={{ x: 0.5, y: 1.9 }}
      style={styles.globalBox}
    >
      {icon}
      <Text color={colors.primary} style={{ lineHeight: 18, marginTop: -2 }}>
        {value}
      </Text>
    </LinearGradient>
  );
};

export default GradientAffirmation;
