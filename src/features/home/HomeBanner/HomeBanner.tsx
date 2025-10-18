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
import { useGetCurrentUserQuery } from "../../../entities";
import { useT } from "../../../shared/lib/hooks";
import { createStyles } from "./HomeBanner.styles";

type HomeBannerProps = {
  type: "gift" | "star"; // Тип баннера: 'gift' или 'star'
};

const HomeBanner = ({ type }: HomeBannerProps) => {
  const t = useT();
  const { theme, colors } = useThemeStore();
  const styles = createStyles(colors, theme);
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();
  const { isRewardClaimed } = useOnboardingStore();
  const animation = useSharedValue(0);
  const { data: user } = useGetCurrentUserQuery();

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

  const gradientColors = {
    dark: [colors.accent, colors.color4] as const,
    light: [colors.accent, colors.color1] as const,
  };

  const BANNER_CONFIG = {
    gift: {
      image: require("@/assets/images/gift.png"),
      title: "onboarding.giftBanner.title",
      text: "onboarding.giftBanner.text",
      isHidden: isRewardClaimed,
      onPressPath: "onboarding",
      onPressAction: "steps",
    },
    star: {
      image: require("@/assets/images/star.png"),
      title: "onboarding.starBanner.title",
      text: "onboarding.starBanner.text",
      isHidden: !isRewardClaimed || user?.subscription?.plan === "pro",
      onPressPath: "subscription",
      onPressAction: "limit",
    },
  };

  const { image, title, text, isHidden, onPressPath, onPressAction } =
    BANNER_CONFIG[type];

  const handleBannerPress = () => {
    navigateToFlow(onPressPath, onPressAction);
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  if (isHidden) return null;

  return (
    <PaddingLayout style={styles.globalBox}>
      <Pressable
        onPressIn={() => animate(1)}
        onPressOut={() => animate(0)}
        onPress={handleBannerPress}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradientColors[theme]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 1.3, y: 0.2 }}
            style={[styles.bannerBox, styles[type]]}
          >
            <TitleText
              text={t(title)}
              textColor={colors.primary}
              variant="subTitle"
            />
            <MarkdownEmojiText
              size="medium"
              color={colors.primary}
              style={styles[`${type}Text`]}
            >
              {t(text)}
            </MarkdownEmojiText>
            <Image source={image} style={styles[`${type}Image`]} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </PaddingLayout>
  );
};

export default HomeBanner;
