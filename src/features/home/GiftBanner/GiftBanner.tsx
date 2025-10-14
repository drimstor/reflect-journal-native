import {
  useBottomSheetStore,
  useOnboardingStore,
  useThemeStore,
} from "@/src/shared/store";
import { MarkdownEmojiText, PaddingLayout, TitleText } from "@/src/shared/ui";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useT } from "../../../shared/lib/hooks";
import { createStyles } from "./GiftBanner.styles";

const GiftBanner = () => {
  const t = useT();
  const { theme, colors } = useThemeStore();
  const styles = createStyles(colors);
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();
  const { isRewardClaimed } = useOnboardingStore();
  const animation = useSharedValue(0);

  const gradientColors = {
    dark: [colors.accent, colors.color4] as const,
    light: [colors.accent, colors.color1] as const,
  };

  // Функция анимации
  const animate = (toValue: number) => {
    animation.value = withSpring(toValue, {
      damping: 15,
      stiffness: 100,
    });
  };

  // Анимированный стиль
  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - animation.value * 0.03;

    return {
      transform: [{ scale }],
    };
  });

  const handleGiftIconPress = () => {
    navigateToFlow("onboarding", "steps");
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  if (isRewardClaimed) return null;

  return (
    <PaddingLayout style={styles.globalBox}>
      <Pressable
        onPressIn={() => animate(1)}
        onPressOut={() => animate(0)}
        onPress={handleGiftIconPress}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradientColors[theme]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 1.3, y: 0.2 }}
            style={styles.bannerBox}
          >
            <TitleText
              text={t("onboarding.banner.title")}
              textColor={colors.primary}
              variant="subTitle"
            />
            <MarkdownEmojiText size="medium" color={colors.primary}>
              {t("onboarding.banner.text")}
            </MarkdownEmojiText>
            <Image
              source={require("@/assets/images/gift.png")}
              style={styles.giftImage}
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </PaddingLayout>
  );
};

export default GiftBanner;
