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
import { useSpeechRecognition } from "./lib/hooks/useSpeechRecognition";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onImagePickerPress?: () => void; // Обработчик нажатия на выбор изображений
  onSpeechRecognized?: (text: string) => void; // Обработчик распознанного текста
}

const AttachmentsPopup: FC<AttachmentsPopupProps> = ({
  isVisible,
  onClose,
  onImagePickerPress,
  onSpeechRecognized,
}) => {
  const { colors, theme } = useThemeStore();
  console.log("AttachmentsPopup Android");

  // Используем кастомный хук для распознавания речи
  const { isListening, startListening, stopListening } =
    useSpeechRecognition(onSpeechRecognized);

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

  // Обработчик нажатия на микрофон
  const handleMicrophonePress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const buttonsConfig = [
    // { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    {
      icon: <ImageIcon color={iconColor} size={22} />,
      onPress: handleImagePress,
    },
    {
      icon: (
        <MicrophoneIcon
          color={isListening ? colors.error : iconColor}
          size={24}
        />
      ),
      onPress: handleMicrophonePress,
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
