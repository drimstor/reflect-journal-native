import { View } from "react-native";
import { createStyles } from "./ShortPreviewBlock.styles";
import { InfoBox, TitleText, Text, Chip, ProgressBar } from "@/src/shared/ui";
import { CalendarIcon, UserBorderIcon } from "@/src/shared/ui/icons";
import { ThemeColors } from "@/src/shared/model/types";
import { ReactNode } from "react";
import { useGetPadding } from "@/src/shared/lib/hooks";

interface ShortPreviewBlockProps {
  colors: ThemeColors;
  title: string;
  value: string;
  element?: ReactNode;
  caption?: string;
  opacityCaption?: string;
}

const ShortPreviewBlock = ({
  colors,
  title,
  element,
  value,
  caption,
  opacityCaption,
}: ShortPreviewBlockProps) => {
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  return (
    <View style={styles.globalBox}>
      <TitleText
        variant="subTitle"
        text={title}
        textColor={colors.contrast}
        element={element}
      />
      <Text withOpacity={70} style={styles.subTitleBox} color={colors.contrast}>
        {value}
      </Text>

      <View style={styles.progressBarBox}>
        <ProgressBar progress={70} />
      </View>

      <View style={styles.captionBox}>
        {opacityCaption && (
          <Text size="medium" withOpacity={70} color={colors.contrast}>
            {opacityCaption}
          </Text>
        )}
        {caption && (
          <Text size="medium" font="bold" color={colors.contrast}>
            {caption}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ShortPreviewBlock;
