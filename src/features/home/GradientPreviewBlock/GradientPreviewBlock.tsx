import { useGetPadding } from "@/src/shared/lib/hooks";
import { ThemeColors } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { ProgressBar, Text, TitleText } from "@/src/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { View } from "react-native";
import { createStyles } from "./GradientPreviewBlock.styles";

interface GradientPreviewBlockProps {
  colors: ThemeColors;
  title: string;
  value: string;
  element?: ReactNode;
  caption?: string;
  captionValue?: string;
}

const GradientPreviewBlock = ({
  colors,
  title,
  element,
  value,
  caption,
  captionValue,
}: GradientPreviewBlockProps) => {
  const { paddingHorizontal } = useGetPadding();
  const { theme } = useThemeStore();
  const styles = createStyles(colors, paddingHorizontal);

  const gradientColors = {
    dark: [colors.accent, colors.color2] as const,
    light: [colors.accent, colors.color2] as const,
  };

  return (
    <LinearGradient
      colors={gradientColors[theme]}
      start={{ x: 0.1, y: 0.7 }}
      end={{ x: 0.5, y: 1.9 }}
      style={{
        borderRadius: 18,
      }}
    >
      <View style={styles.globalBox}>
        <TitleText
          variant="subTitle"
          text={title}
          textColor={colors.primary}
          element={element}
        />
        <Text style={styles.subTitleBox} color={colors.primary}>
          {value}
        </Text>

        <View style={styles.progressBarBox}>
          <View style={styles.progressBarTextBox}>
            <Text
              withOpacity={70}
              size="medium"
              style={styles.subTitleBox}
              color={colors.primary}
              font="bold"
            >
              {caption}
            </Text>
            <Text
              withOpacity={70}
              size="medium"
              style={styles.subTitleBox}
              color={colors.primary}
              font="bold"
            >
              {captionValue}
            </Text>
          </View>
          <ProgressBar
            progressColor={colors.primary}
            backgroundColor={colors.secondary + 30}
            progress={25}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default GradientPreviewBlock;
