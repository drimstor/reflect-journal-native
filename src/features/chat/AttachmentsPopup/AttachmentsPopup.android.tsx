import { useThemeStore } from "@/src/shared/store";
import {
  DocumentTextIcon,
  ImageIcon,
  MicrophoneIcon,
} from "@/src/shared/ui/icons";
import { FC, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles } from "./AttachmentsPopup.styles";
import { useVoiceRecording } from "./lib/hooks/useVoiceRecording";
import { RecordingControl } from "./ui/RecordingControl/RecordingControl";

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
  const { colors, theme } = useThemeStore();
  const [isRecordingVisible, setIsRecordingVisible] = useState(false);

  // Используем кастомный хук для управления записью (только для Android)
  const {
    isPaused,
    recordingTime,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useVoiceRecording();

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

  // Обработчик нажатия на микрофон (только для Android)
  const handleMicrophonePress = async () => {
    setIsRecordingVisible(true);
    await startRecording();
    onClose(); // Закрываем попап с вложениями
  };

  // Обработчик остановки записи (только для Android)
  const handleStopRecording = async () => {
    await stopRecording();
    setIsRecordingVisible(false);

    // Выводим распознанный текст в консоль
    if (recognizedText) {
      console.log("Распознанный текст из голоса:", recognizedText);
    }

    // Сбрасываем состояние записи
    resetRecording();
  };

  // Обработчик паузы (только для Android)
  const handlePauseRecording = () => {
    pauseRecording();
  };

  // Обработчик возобновления (только для Android)
  const handleResumeRecording = async () => {
    await resumeRecording();
  };

  // Обработчик нажатия на выбор изображений
  const handleImagePress = () => {
    if (onImagePickerPress) {
      onImagePickerPress();
    }
    onClose(); // Закрываем попап после выбора
  };

  const buttonsConfig = [
    { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    {
      icon: <MicrophoneIcon color={iconColor} size={24} />,
      onPress: handleMicrophonePress,
    },
    {
      icon: <ImageIcon color={iconColor} size={22} />,
      onPress: handleImagePress,
    },
  ];

  return (
    <>
      <OutsidePressHandler
        style={[
          styles.container,
          { pointerEvents: isVisible ? "auto" : "none" },
        ]}
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

      <RecordingControl
        isVisible={isRecordingVisible}
        isPaused={isPaused}
        recordingTime={recordingTime}
        error={error}
        onPause={handlePauseRecording}
        onResume={handleResumeRecording}
        onStop={handleStopRecording}
      />
    </>
  );
};

export default AttachmentsPopup;
