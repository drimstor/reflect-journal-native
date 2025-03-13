import { FC, ReactNode, useMemo, useCallback, useState } from "react";
import { StyleProp, ViewStyle, Animated } from "react-native";
import { createStyles } from "./IconButton.styles";
import { useThemeStore } from "@/src/shared/store";
import { Pressable } from "react-native-gesture-handler";
import { useTimingAnimation } from "../../lib/hooks";
import { useAnimation } from "./lib/hooks/useAnimation";

interface IconButtonProps {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isAnimated?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  children,
  onPress,
  style,
  isAnimated = false,
}) => {
  const { colors, theme } = useThemeStore();
  const styles = useMemo(() => createStyles(colors), [theme]);
  const { animatedStyle, handlePressIn, handlePressOut } =
    useAnimation(isAnimated);

  return (
    <Animated.View style={isAnimated ? animatedStyle : undefined}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.touchableOpacity, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default IconButton;
