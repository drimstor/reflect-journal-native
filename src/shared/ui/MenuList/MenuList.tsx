import { useThemeStore } from "@/src/shared/store";
import { Divider, Text } from "@/src/shared/ui";
import { FC, ReactNode } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";
import { createStyles } from "./MenuList.styles";
import MenuListItem from "./MenuListItem";

interface ListProps {
  items: Array<{
    text: string | ReactNode;
    IconComponent?: (props: { color: string; size: number }) => ReactNode;
    onPress: () => void;
    element?: ReactNode;
    isDisabled?: boolean;
  }>;
  style?: StyleProp<ViewStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  title?: string;
}

const MenuList: FC<ListProps> = ({ items, style, onLayout, title }) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

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
            <MenuListItem {...item} />
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
