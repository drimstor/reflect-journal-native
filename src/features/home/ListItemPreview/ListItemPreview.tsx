import { View, Pressable } from "react-native";
import { createStyles } from "./ListItemPreview.styles";
import { useGetPadding } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { useColorsAnimate } from "./lib/hooks/useColorsAnimate";
import { ListItemPreviewProps } from "./model/types";
import { AnimatedText, Text } from "@/src/shared/ui";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

const { contrast, contrastReverse } = useThemeStore.getState().colors;

const ListItemPreview = ({
  title,
  subTitle,
  IconComponent,
  customComponent,
  backgroundColor = contrastReverse,
  backgroundColorForAnimate = contrast,
  onPress,
  element,
}: ListItemPreviewProps) => {
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  const {
    animate,
    animation,
    backgroundColor: bg,
    backgroundColorForAnimate: bgAnimate,
    color,
    colorForAnimate,
  } = useColorsAnimate({
    backgroundColor,
    backgroundColorForAnimate,
    color: colors.contrast,
    colorForAnimate: colors.contrast,
  });

  // Создаем анимированные стили с Reanimated
  const bgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [0, 1],
        [bg, bgAnimate]
      ),
    };
  });

  const textColorStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        animation.value,
        [0, 1],
        [color, colorForAnimate]
      ),
    };
  });

  return (
    <Pressable
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onPress={onPress}
    >
      <Animated.View style={[styles.globalBox, bgStyle]}>
        <View style={styles.iconBox}>
          {customComponent}
          {IconComponent?.({
            color: colors.contrast,
            size: 24,
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
            <AnimatedText size="small" animatedStyle={textColorStyle}>
              {subTitle}
            </AnimatedText>
          )}
        </View>
        {element && <View style={styles.iconBox}>{element}</View>}
      </Animated.View>
    </Pressable>
  );
};

export default ListItemPreview;
