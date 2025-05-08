import { View, Animated, Pressable } from "react-native";
import { createStyles } from "./ListItemPreview.styles";
import { useGetPadding } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { DotsIcon } from "@/src/shared/ui/iconsAnimated";
import { useColorsAnimate } from "./lib/hooks/useColorsAnimate";
import { ListItemPreviewProps } from "./model/types";
import { AnimatedText, Text } from "@/src/shared/ui";

const { contrast, contrastReverse } = useThemeStore.getState().colors;

const ListItemPreview = ({
  title,
  subTitle,
  IconComponent,
  customComponent,
  backgroundColor = contrastReverse,
  backgroundColorForAnimate = contrast,
  onPress,
  onDotsPress,
}: ListItemPreviewProps) => {
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  const { animatedColor, animatedBackgroundColor, animate } = useColorsAnimate({
    backgroundColor,
    backgroundColorForAnimate,
    color: colors.contrast,
    colorForAnimate: colors.contrast,
  });

  return (
    <Pressable
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onPress={onPress}
    >
      <Animated.View
        style={[styles.globalBox, { backgroundColor: animatedBackgroundColor }]}
      >
        <View style={styles.iconBox}>
          {customComponent}
          {IconComponent?.({
            color: colors.contrast,
            size: 24,
            animatedStyle: { stroke: animatedColor },
          })}
        </View>
        <View style={styles.textBox}>
          <Text
            font="bold"
            color={colors.contrast}
            numberOfLines={1}
            style={{ maxWidth: 280 }}
          >
            {title}
          </Text>
          {subTitle && (
            <AnimatedText size="small" animatedStyle={{ color: animatedColor }}>
              {subTitle}
            </AnimatedText>
          )}
        </View>
        <Pressable onPress={onDotsPress}>
          <View style={styles.iconBox}>
            <DotsIcon
              color={colors.contrast}
              size={24}
              animatedProps={{ fill: animatedColor }}
            />
          </View>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

export default ListItemPreview;
