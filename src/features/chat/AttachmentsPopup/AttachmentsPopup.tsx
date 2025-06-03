import { FC, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import { useThemeStore } from "@/src/shared/store";
import {
  DocumentTextIcon,
  MicrophoneIcon,
  ImageIcon,
} from "@/src/shared/ui/icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { createStyles } from "./AttachmentsPopup.styles";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AttachmentsPopup: FC<AttachmentsPopupProps> = ({
  isVisible,
  onClose,
}) => {
  const { colors, theme } = useThemeStore();

  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withSpring(isVisible ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = animationValue.value;
    const translateY = interpolate(animationValue.value, [0, 1], [50, 0]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const styles = createStyles(colors, theme);
  const iconColor = theme === "dark" ? colors.accent : colors.primary;

  const buttonsConfig = [
    { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    { icon: <MicrophoneIcon color={iconColor} size={24} /> },
    { icon: <ImageIcon color={iconColor} size={22} /> },
  ];

  return (
    <OutsidePressHandler
      style={[styles.container, { pointerEvents: isVisible ? "auto" : "none" }]}
      onOutsidePress={onClose}
      disabled={!isVisible}
    >
      <Animated.View style={[styles.popup, animatedStyle]}>
        {buttonsConfig.map((button, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            {button.icon}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </OutsidePressHandler>
  );
};

export default AttachmentsPopup;
