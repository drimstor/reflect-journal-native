import { FC, ReactNode } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";
import ListItem from "./ListItem";
import { styles } from "./List.styles";
import { Divider } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import ListItemReverse from "./ListItemReverse";

interface ListProps {
  items: Array<{
    text: string;
    IconComponent: (props: { color: string; size: number }) => ReactNode;
    onPress: () => void;
    element?: ReactNode;
  }>;
  style?: StyleProp<ViewStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  listItemVariant?: "default" | "reverse";
}

const List: FC<ListProps> = ({
  items,
  style,
  onLayout,
  listItemVariant = "default",
}) => {
  const { colors } = useThemeStore();

  const listItemConfig = {
    default: ListItem,
    reverse: ListItemReverse,
  };

  const ListItemComponent = listItemConfig[listItemVariant];

  return (
    <View style={[styles.listBox, style]} onLayout={onLayout}>
      {items.map((item, index) => (
        <View key={index}>
          <ListItemComponent
            text={item.text}
            IconComponent={item.IconComponent}
            onPress={item.onPress}
            element={item.element}
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
