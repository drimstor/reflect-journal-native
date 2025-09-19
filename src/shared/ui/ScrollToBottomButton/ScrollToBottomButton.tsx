import { useThemeStore } from "@/src/shared/store";
import { IconButton } from "@/src/shared/ui";
import { ArrowLeftIcon } from "@/src/shared/ui/icons";
import React, { FC } from "react";
import { Animated, View } from "react-native";
import { createStyles } from "./ScrollToBottomButton.styles";

interface ScrollToBottomButtonProps {
  onPress: () => void;
  animation: any; // Принимаем анимацию напрямую
}

const ScrollToBottomButton: FC<ScrollToBottomButtonProps> = ({
  onPress,
  animation,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  // Интерполяция для translateY (0 -> 20px смещение, 1 -> 0px)
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation, // Прямое использование animation для opacity
          transform: [{ translateY }], // Интерполированное значение для translateY
        },
      ]}
    >
      <IconButton isAnimated onPress={onPress}>
        <View style={styles.iconContainer}>
          <ArrowLeftIcon color={colors.contrast} size={20} />
        </View>
      </IconButton>
    </Animated.View>
  );
};

export default ScrollToBottomButton;
