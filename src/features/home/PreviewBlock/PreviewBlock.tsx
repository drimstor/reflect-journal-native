import { Animated, Pressable, View } from "react-native";
import { createStyles } from "./PreviewBlock.styles";
import { InfoBox, TitleText, Text, Chip, ProgressBar } from "@/src/shared/ui";
import { ReactNode } from "react";
import { useTimingAnimation } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { calculateProgress, stringToColor } from "@/src/shared/lib/helpers";
import {
  BoxSolidIcon,
  BackSquareSolidIcon,
  ClipboardTickSolidIcon,
  DirectSolidIcon,
  ArchiveSolidIcon,
} from "@/src/shared/ui/icons";
import { LibraryListVariant } from "@/src/shared/model/types";
import { ChecklistItem } from "@/src/entities/goals/model/types";

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
  backgroundIcon?: LibraryListVariant;
  bookmarked?: boolean;
  onPress?: () => void;
  tags?: string[];
  checklist?: ChecklistItem[];
  disableAnimate?: boolean;
}

const PreviewBlock = ({
  title,
  element,
  value,
  infoBoxes,
  backgroundColor,
  backgroundColorForAnimate,
  backgroundIcon,
  bookmarked,
  onPress,
  tags,
  checklist,
  disableAnimate,
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

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });

  const background = backgroundColorForAnimate
    ? animatedBackgroundColor
    : backgroundColor;

  const backgroundIconConfig = {
    Journals: <BackSquareSolidIcon color={colors.contrast} size={180} />,
    Chats: <BoxSolidIcon color={colors.contrast} size={180} />,
    Goals: <ClipboardTickSolidIcon color={colors.contrast} size={160} />,
    Summaries: <DirectSolidIcon color={colors.contrast} size={160} />,
  };

  return (
    <Pressable
      onPressIn={() => {
        disableAnimate ? null : animate(1);
      }}
      onPressOut={() => {
        disableAnimate ? null : animate(0);
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.globalBox,
          {
            backgroundColor: background,
            transform: [{ scale: animatedScale }],
          },
        ]}
      >
        {bookmarked && (
          <View style={styles.bookmarkedIconBox}>
            <ArchiveSolidIcon color={colors.error} size={20} />
          </View>
        )}
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

        {!!tags?.length && (
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

        {checklist && (
          <View style={styles.progressBarBox}>
            <Text withOpacity={70} size="small" color={colors.contrast}>
              {`${calculateProgress(checklist)}% completed`}
            </Text>
            <ProgressBar progress={calculateProgress(checklist)} />
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
        {backgroundIcon && (
          <View style={[styles.backgroundIconBox, styles[backgroundIcon]]}>
            {backgroundIconConfig[backgroundIcon]}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default PreviewBlock;
