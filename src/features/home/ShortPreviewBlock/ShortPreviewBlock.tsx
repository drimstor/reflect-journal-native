import { useGetPadding } from "@/src/shared/lib/hooks";
import { ThemeColors } from "@/src/shared/model/types";
import { ProgressBar, Text, TitleText } from "@/src/shared/ui";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles } from "./ShortPreviewBlock.styles";

interface ShortPreviewBlockProps {
  colors: ThemeColors;
  title: string;
  value: string;
  element?: ReactNode;
  caption?: string;
  opacityCaption?: string;
  onPress?: () => void;
  progress?: number;
  isAnimate?: boolean;
}

const ShortPreviewBlock = ({
  colors,
  title,
  element,
  value,
  caption,
  opacityCaption,
  onPress,
  progress = 70,
  isAnimate = true,
}: ShortPreviewBlockProps) => {
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  const animation = useSharedValue(0);

  const animate = (toValue: number) => {
    if (isAnimate) {
      animation.value = withSpring(toValue, {
        damping: 15,
        stiffness: 100,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - animation.value * 0.03;

    return {
      backgroundColor: interpolateColor(
        animation.value,
        [0, 1],
        [colors.secondary, colors.secondary]
      ),
      transform: [{ scale }],
    };
  });

  const pressableProps = {
    ...(onPress && {
      onPress,
      onPressIn: () => animate(1),
      onPressOut: () => animate(0),
    }),
  };

  return (
    <Pressable {...pressableProps}>
      <Animated.View
        style={[
          styles.globalBox,
          isAnimate ? animatedStyle : { backgroundColor: colors.light },
        ]}
      >
        <TitleText
          variant="subTitle"
          text={title}
          textColor={colors.contrast}
          element={element}
        />
        <Text
          withOpacity={70}
          style={styles.subTitleBox}
          color={colors.contrast}
        >
          {value}
        </Text>

        <View style={styles.progressBarBox}>
          <ProgressBar progress={progress} />
        </View>

        <View style={styles.captionBox}>
          {opacityCaption && (
            <Text size="medium" withOpacity={70} color={colors.contrast}>
              {opacityCaption}
            </Text>
          )}
          {caption && (
            <Text size="medium" font="bold" color={colors.contrast}>
              {caption}
            </Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ShortPreviewBlock;
