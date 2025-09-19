import { FC, ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { useThemeStore } from "../../store";
import Text from "../Text/Text";
import { styles } from "./List.styles";

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
      <Text font="bold" color={colors.contrast}>
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
