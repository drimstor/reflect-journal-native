import { Animated, Pressable, View } from "react-native";
import { createStyles } from "./PreviewBlock.styles";
import { InfoBox, TitleText, Text, Chip } from "@/src/shared/ui";
import { ReactNode } from "react";
import { useTimingAnimation } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { stringToColor } from "@/src/shared/lib/helpers";
import {
  BoxSolidIcon,
  BackSquareSolidIcon,
  LifebuoySolidIcon,
  MaskSolidIcon,
  CloudSolidIcon,
  GridSolidIcon,
  CpuSolidIcon,
} from "@/src/shared/ui/icons";
interface PreviewBlockProps {
  title?: string;
  element?: ReactNode;
  value?: string;
  infoBoxes: {
    label: string;
    value: string;
    icon: ReactNode;
  }[];
  backgroundColor?: string;
  backgroundColorForAnimate?: string;
  onPress?: () => void;
  tags?: string[];
}

const PreviewBlock = ({
  title,
  element,
  value,
  infoBoxes,
  backgroundColor,
  backgroundColorForAnimate,
  onPress,
  tags,
}: PreviewBlockProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { animate, animation } = useTimingAnimation();

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      backgroundColor || colors.light,
      backgroundColorForAnimate || colors.alternate,
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
        {title && (
          <TitleText
            variant="subTitle"
            text={title}
            textColor={colors.contrast}
            element={element}
            style={styles.titleBox}
          />
        )}

        {value && (
          <Text
            withOpacity={title ? 70 : undefined}
            style={styles.subTitleBox}
            color={colors.contrast}
          >
            {value}
          </Text>
        )}

        {tags && (
          <View style={styles.tagsBox}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                title={tag}
                size="small"
                color={stringToColor(tag)}
              />
            ))}
          </View>
        )}

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
        <View style={styles.backgroundIconBox}>
          <BackSquareSolidIcon color={colors.contrast} size={220} />
          {/* <BoxSolidIcon color={colors.contrast} size={220} /> */}
          {/* <LifebuoySolidIcon color={colors.contrast} size={220} /> */}
          {/* <CpuSolidIcon color={colors.contrast} size={220} /> */}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default PreviewBlock;
