import { FC, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { createStyles } from "./MenuList.styles";
import Text from "../Text/Text";
import { useThemeStore } from "../../store";

interface ListItemReverseProps {
  onPress: () => void;
  text: string;
  IconComponent: (props: { color: string; size: number }) => ReactNode;
  element?: ReactNode;
}

const MenuListItemItemReverse: FC<ListItemReverseProps> = ({
  onPress,
  text,
  IconComponent,
  element,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemBox}>
      {IconComponent({
        color: colors.contrast,
        size: 24,
      })}
      <Text font="bold" color={colors.contrast} style={{ fontSize: 16 }}>
        {text}
      </Text>
      <View style={styles.elementBox}>{element}</View>
    </TouchableOpacity>
  );
};

export default MenuListItemItemReverse;
