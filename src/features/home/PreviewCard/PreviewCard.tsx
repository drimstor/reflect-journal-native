import { View } from "react-native";
import { createStyles } from "./PreviewCard.styles";
import { Text } from "@/src/shared/ui";
import { ReactNode } from "react";
import { useGetPadding } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";

export interface PreviewCardProps {
  title: string;
  subTitle: string;
  icon: ReactNode;
  backgroundColor?: string;
}

const PreviewCard = ({
  title,
  subTitle,
  icon,
  backgroundColor,
}: PreviewCardProps) => {
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  return (
    <View style={[styles.globalBox, { backgroundColor }]}>
      <View style={styles.textBox}>
        <Text
          style={styles.title}
          size="header"
          font="bold"
          color={colors.black}
        >
          {title}
        </Text>
        <Text withOpacity={80} style={styles.subTitle} color={colors.black}>
          {subTitle}
        </Text>
      </View>
      <View style={styles.iconBox}>{icon}</View>
    </View>
  );
};

export default PreviewCard;
