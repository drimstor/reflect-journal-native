import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import ListItem from "./ListItem";
import { styles } from "./List.styles";
import { Divider } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";

interface ListProps {
  items: Array<{
    text: string;
    IconComponent: (props: { color: string; size: number }) => ReactNode;
    onPress: () => void;
  }>;
  style?: StyleProp<ViewStyle>;
}

const List: FC<ListProps> = ({ items, style }) => {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.listBox, style]}>
      {items.map((item, index) => (
        <View key={index}>
          <ListItem
            text={item.text}
            IconComponent={item.IconComponent}
            onPress={item.onPress}
          />
          {index < items.length - 1 && (
            <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
          )}
        </View>
      ))}
    </View>
  );
};

export default List;
