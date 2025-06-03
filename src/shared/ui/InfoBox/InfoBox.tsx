import { FC, ReactNode } from "react";
import { View } from "react-native";
import { Text, MarkdownEmojiText } from "@/src/shared/ui";
import { styles } from "./InfoBox.styles";

interface InfoBoxProps {
  label: string;
  icon: ReactNode;
  value: string;
  color?: string;
}

const InfoBox: FC<InfoBoxProps> = ({ label, icon, value, color }) => {
  return (
    <View style={styles.infoBox}>
      <Text withOpacity={70} size="small" color={color}>
        {label}
      </Text>
      <View style={styles.infoBoxItem}>
        {icon}
        <MarkdownEmojiText font="bold" color={color}>
          {value}
        </MarkdownEmojiText>
      </View>
    </View>
  );
};

export default InfoBox;
