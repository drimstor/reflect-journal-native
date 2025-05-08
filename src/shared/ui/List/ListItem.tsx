import { FC, ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { styles } from "./List.styles";
import Text from "../Text/Text";
import { useThemeStore } from "../../store";

interface ListItemProps {
  onPress: () => void;
  text: string;
  IconComponent: (props: { color: string; size: number }) => ReactNode;
}

const ListItem: FC<ListItemProps> = ({ onPress, text, IconComponent }) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.listItemBox, styles.listItemDefault]}
    >
      <Text font="bold" color={colors.contrast} style={{ fontSize: 16 }}>
        {text}
      </Text>
      {IconComponent({
        color: colors.contrast,
        size: 24,
      })}
    </TouchableOpacity>
  );
};

export default ListItem;
