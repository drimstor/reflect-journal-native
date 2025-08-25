import { useThemeStore } from "@/src/shared/store";
import { Divider, Text } from "@/src/shared/ui";
import { FC, ReactNode } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";
import { createStyles } from "./MenuList.styles";
import ListItem from "./MenuListItem";
import ListItemReverse from "./MenuListItemReverse";

interface ListProps {
  items: Array<{
    text: string | ReactNode;
    IconComponent: (props: { color: string; size: number }) => ReactNode;
    onPress: () => void;
    element?: ReactNode;
  }>;
  style?: StyleProp<ViewStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  listItemVariant?: "default" | "reverse";
  title?: string;
}

const MenuList: FC<ListProps> = ({
  items,
  style,
  onLayout,
  title,
  listItemVariant = "default",
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const listItemConfig = {
    default: ListItem,
    reverse: ListItemReverse,
  };

  const ListItemComponent = listItemConfig[listItemVariant];

  return (
    <View style={[styles.globalBox, style]}>
      {title && (
        <Text
          style={styles.listTitle}
          size="small"
          withOpacity={80}
          color={colors.contrast}
        >
          {title}
        </Text>
      )}

      <View style={styles.listBox} onLayout={onLayout}>
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
    </View>
  );
};

export default MenuList;
