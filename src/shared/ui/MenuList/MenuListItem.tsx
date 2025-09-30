import { FC, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../store";
import Text from "../Text/Text";
import { createStyles } from "./MenuList.styles";

interface ListItemProps {
  onPress: () => void;
  text: string | ReactNode;
  IconComponent?: (props: { color: string; size: number }) => ReactNode;
  element?: ReactNode;
  isDisabled?: boolean;
}

const MenuListItem: FC<ListItemProps> = ({
  onPress,
  text,
  IconComponent,
  element,
  isDisabled,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.listItemBox}
      disabled={isDisabled}
    >
      {IconComponent?.({ color: colors.contrast, size: 24 })}
      <Text
        font="bold"
        color={colors.contrast}
        style={styles.textStyle}
        withOpacity={isDisabled ? 60 : undefined}
      >
        {text}
      </Text>
      <View style={styles.elementBox}>{element}</View>
    </TouchableOpacity>
  );
};

export default MenuListItem;
