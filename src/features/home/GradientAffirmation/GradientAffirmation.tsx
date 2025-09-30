import { ThemeColors } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { createStyles } from "./GradientAffirmation.styles";

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
    dark: [colors.accent, colors.color2] as const,
    light: [colors.accent, colors.color2] as const,
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
