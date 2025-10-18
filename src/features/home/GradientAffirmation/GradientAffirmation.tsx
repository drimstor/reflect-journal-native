import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { createStyles } from "./GradientAffirmation.styles";

interface GradientAffirmationProps {
  value: string;
  element?: ReactNode;
  icon?: ReactNode;
}

const GradientAffirmation = ({ value, icon }: GradientAffirmationProps) => {
  const { theme, colors } = useThemeStore();
  const styles = createStyles(colors, theme);

  const gradientColors = {
    dark: [colors.accent, colors.color4] as const,
    light: [colors.accent, colors.color3] as const,
  };

  return (
    <LinearGradient
      colors={gradientColors[theme]}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.3, y: 2.5 }}
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
