import { ChecklistItem } from "@/src/entities/goals/model/types";
import { calculateProgress, stringToColor } from "@/src/shared/lib/helpers";
import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import {
  Chip,
  InfoBox,
  MarkdownEmojiText,
  ProgressBar,
  Text,
  TitleText,
} from "@/src/shared/ui";
import {
  ArchiveSolidIcon,
  BackSquareSolidIcon,
  ChartIcon,
  ClipboardSolidIcon,
  ClipboardTickSolidIcon,
  DirectSolidIcon,
  LifebuoySolidIcon,
  LinkSolidIcon,
  MailSolidIcon,
} from "@/src/shared/ui/icons";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles } from "./PreviewBlock.styles";

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
  backgroundIcon?: EntityType;
  bookmarked?: boolean;
  onPress?: () => void;
  tags?: string[];
  checklist?: ChecklistItem[];
  disableAnimate?: boolean;
  previewMode?: boolean;
  valueOpacity?: number | string;
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
  previewMode,
  valueOpacity = 70,
}: PreviewBlockProps) => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const animation = useSharedValue(0);

  const animate = (toValue: number) => {
    if (!disableAnimate) {
      animation.value = withSpring(toValue, {
        damping: 15,
        stiffness: 100,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - animation.value * 0.03;

    return {
      backgroundColor: backgroundColorForAnimate
        ? interpolateColor(
            animation.value,
            [0, 1],
            [
              backgroundColor || colors.light,
              backgroundColorForAnimate || colors.alternate,
            ]
          )
        : backgroundColor || colors.light,
      transform: [{ scale }],
    };
  });

  const backgroundIconConfig = {
    Journals: <BackSquareSolidIcon color={colors.contrast} size={180} />,
    Chats: <MailSolidIcon color={colors.contrast} size={140} />,
    Goals: <ClipboardTickSolidIcon color={colors.contrast} size={160} />,
    Summaries: <DirectSolidIcon color={colors.contrast} size={160} />,
    JournalEntries: <BackSquareSolidIcon color={colors.contrast} size={180} />,
    Charts: <LifebuoySolidIcon color={colors.contrast} size={190} />,
    RelationshipMap: <LinkSolidIcon color={colors.contrast} size={160} />,
    Timeline: <ChartIcon color={colors.contrast} size={160} />,
    Tests: <ClipboardSolidIcon color={colors.contrast} size={160} />,
    TestResults: <ClipboardSolidIcon color={colors.contrast} size={160} />,
  };

  console.log({ checklist });

  return (
    <Pressable
      onPressIn={() => animate(1)}
      onPressOut={() => animate(0)}
      onPress={onPress}
    >
      <Animated.View style={[styles.globalBox, animatedStyle]}>
        {bookmarked && (
          <View style={styles.bookmarkedIconBox}>
            <ArchiveSolidIcon color={colors.error} size={20} />
          </View>
        )}
        {(title || element) && (
          <TitleText
            variant="subTitle"
            text={title || ""}
            textColor={colors.contrast}
            element={element}
            style={styles.titleBox}
            numberOfLines={previewMode ? 1 : undefined}
            ellipsizeMode={previewMode ? "tail" : undefined}
          />
        )}

        {value && (
          <MarkdownEmojiText
            withOpacity={title ? valueOpacity : undefined}
            style={styles.subTitleBox}
            color={colors.contrast}
            numberOfLines={previewMode ? 10 : undefined}
            ellipsizeMode={previewMode ? "tail" : undefined}
            size="base"
          >
            {value}
          </MarkdownEmojiText>
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

        {!!checklist?.length && (
          <View style={styles.progressBarBox}>
            <Text withOpacity={70} size="small" color={colors.contrast}>
              {`${calculateProgress(checklist)}% ${t(
                "shared.actions.completed"
              ).toLowerCase()}`}
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
          <View
            style={[
              styles.backgroundIconBox,
              styles[backgroundIcon as keyof typeof styles],
            ]}
          >
            {
              backgroundIconConfig[
                backgroundIcon as keyof typeof backgroundIconConfig
              ]
            }
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default PreviewBlock;
