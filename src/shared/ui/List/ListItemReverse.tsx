import { FC, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./List.styles";
import Text from "../Text/Text";
import { useThemeStore } from "../../store";

interface ListItemReverseProps {
  onPress: () => void;
  text: string;
  IconComponent: (props: { color: string; size: number }) => ReactNode;
  element?: ReactNode;
}

const ListItemReverse: FC<ListItemReverseProps> = ({
  onPress,
  text,
  IconComponent,
  element,
}) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemBox}>
      <View style={styles.iconBox}>
        {IconComponent({
          color: colors.contrast,
          size: 24,
        })}
      </View>
      <Text font="bold" color={colors.contrast} style={{ fontSize: 16 }}>
        {text}
      </Text>
      <View style={styles.elementBox}>{element}</View>
    </TouchableOpacity>
  );
};

export default ListItemReverse;
