import { FC, ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { createStyles } from "./MenuList.styles";
import Text from "../Text/Text";
import { useThemeStore } from "../../store";

interface ListItemProps {
  onPress: () => void;
  text: string;
  IconComponent: (props: { color: string; size: number }) => ReactNode;
}

const MenuListItem: FC<ListItemProps> = ({ onPress, text, IconComponent }) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

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

export default MenuListItem;
