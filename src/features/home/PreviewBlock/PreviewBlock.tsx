import { Animated, Pressable, View } from "react-native";
import { createStyles } from "./PreviewBlock.styles";
import { InfoBox, TitleText, Text } from "@/src/shared/ui";
import { ThemeColors } from "@/src/shared/model/types";
import { ReactNode } from "react";
import { useGetPadding, useTimingAnimation } from "@/src/shared/lib/hooks";
import { stringToColor } from "@/src/shared/lib/helpers";

interface PreviewBlockProps {
  colors: ThemeColors;
  title: string;
  element: ReactNode;
  value: string;
  infoBoxes: {
    label: string;
    value: string;
    icon: ReactNode;
  }[];
  backgroundColor?: string;
  backgroundColorForAnimate?: string;
  onPress?: () => void;
}

const PreviewBlock = ({
  colors,
  title,
  element,
  value,
  infoBoxes,
  backgroundColor,
  backgroundColorForAnimate,
  onPress,
}: PreviewBlockProps) => {
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors, paddingHorizontal);

  const { animate, animation } = useTimingAnimation();

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      backgroundColor ?? colors.light,
      backgroundColorForAnimate ?? colors.alternate,
    ],
  });

  const background = backgroundColorForAnimate
    ? animatedBackgroundColor
    : backgroundColor;

  return (
    <Pressable
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.globalBox,
          {
            backgroundColor: background,
          },
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

        <View style={styles.infoTableBox}>
          {infoBoxes.map((infoBox) => (
            <InfoBox
              key={infoBox.label}
              label={infoBox.label}
              icon={infoBox.icon}
              value={infoBox.value}
              color={colors.contrast}
            />
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default PreviewBlock;
