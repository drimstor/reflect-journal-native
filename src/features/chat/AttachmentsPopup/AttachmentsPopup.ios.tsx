import { useThemeStore } from "@/src/shared/store";
import { ImageIcon, MicrophoneIcon } from "@/src/shared/ui/icons";
import { FC, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles } from "./AttachmentsPopup.styles";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onImagePickerPress?: () => void; // Обработчик нажатия на выбор изображений
}

const AttachmentsPopup: FC<AttachmentsPopupProps> = ({
  isVisible,
  onClose,
  onImagePickerPress,
}) => {
  console.log("AttachmentsPopup iOS");

  const { colors, theme } = useThemeStore();

  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withSpring(isVisible ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isVisible, animationValue]);

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

  // Обработчик нажатия на выбор изображений
  const handleImagePress = () => {
    if (onImagePickerPress) {
      onImagePickerPress();
    }
    onClose(); // Закрываем попап после выбора
  };

  const buttonsConfig = [
    // { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    {
      icon: <MicrophoneIcon color={iconColor} size={24} />,
      onPress: undefined,
    },
    {
      icon: <ImageIcon color={iconColor} size={22} />,
      onPress: handleImagePress,
    },
  ];

  return (
    <OutsidePressHandler
      style={[styles.container, { pointerEvents: isVisible ? "auto" : "none" }]}
      onOutsidePress={onClose}
      disabled={!isVisible}
    >
      <Animated.View style={[styles.popup, animatedStyle]}>
        {buttonsConfig.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={button.onPress}
          >
            {button.icon}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </OutsidePressHandler>
  );
};

export default AttachmentsPopup;
