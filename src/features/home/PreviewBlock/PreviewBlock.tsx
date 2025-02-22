import { View } from "react-native";
import { createStyles } from "./PreviewBlock.styles";
import { InfoBox, TitleText, Text } from "@/src/shared/ui";
import { ThemeColors } from "@/src/shared/model/types";
import { ReactNode } from "react";
import { useGetPadding } from "@/src/shared/lib/hooks";

interface PreviewBlockProps {
  colors: ThemeColors;
  title: string;
  element: ReactNode;
  value: string;
  infoBoxes: {
    label: string;
    value: string;
    icon: ReactNode;
  }[];
}

const PreviewBlock = ({
  colors,
  title,
  element,
  value,
  infoBoxes,
}: PreviewBlockProps) => {
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  return (
    <View style={[styles.globalBox]}>
      <TitleText
        variant="subTitle"
        text={title}
        textColor={colors.contrast}
        element={element}
      />
      <Text withOpacity={70} style={styles.subTitleBox} color={colors.contrast}>
        {value}
      </Text>

      <View style={styles.infoTableBox}>
        {infoBoxes.map((infoBox) => (
          <InfoBox
            key={infoBox.label}
            label={infoBox.label}
            icon={infoBox.icon}
            value={infoBox.value}
            color={colors.contrast}
          />
        ))}
      </View>
    </View>
  );
};

export default PreviewBlock;
