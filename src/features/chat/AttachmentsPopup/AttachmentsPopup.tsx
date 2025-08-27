import { useThemeStore } from "@/src/shared/store";
import {
  DocumentTextIcon,
  ImageIcon,
  MicrophoneIcon,
} from "@/src/shared/ui/icons";
import React, { FC, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles } from "./AttachmentsPopup.styles";
// import { useVoiceRecording } from "./lib/hooks/useVoiceRecording";
// import { RecordingControl } from "./ui/RecordingControl/RecordingControl";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AttachmentsPopup: FC<AttachmentsPopupProps> = ({
  isVisible,
  onClose,
}) => {
  const { colors, theme } = useThemeStore();
  const [isRecordingVisible, setIsRecordingVisible] = useState(false);

  // Используем кастомный хук для управления записью
  // const {
  //   isRecording,
  //   isPaused,
  //   recordingTime,
  //   recognizedText,
  //   error,
  //   startRecording,
  //   stopRecording,
  //   pauseRecording,
  //   resumeRecording,
  //   resetRecording,
  // } = useVoiceRecording();

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

  // // Обработчик нажатия на микрофон
  // const handleMicrophonePress = async () => {
  //   setIsRecordingVisible(true);
  //   await startRecording();
  //   onClose(); // Закрываем попап с вложениями
  // };

  // // Обработчик остановки записи
  // const handleStopRecording = async () => {
  //   await stopRecording();
  //   setIsRecordingVisible(false);

  //   // Выводим распознанный текст в консоль
  //   if (recognizedText) {
  //     console.log("Распознанный текст из голоса:", recognizedText);
  //   }

  //   // Сбрасываем состояние записи
  //   resetRecording();
  // };

  // // Обработчик паузы
  // const handlePauseRecording = () => {
  //   pauseRecording();
  // };

  // // Обработчик возобновления
  // const handleResumeRecording = async () => {
  //   await resumeRecording();
  // };

  const buttonsConfig = [
    { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    {
      icon: <MicrophoneIcon color={iconColor} size={24} />,
      // onPress: handleMicrophonePress,
    },
    { icon: <ImageIcon color={iconColor} size={22} /> },
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
              // onPress={button.onPress}
            >
              {button.icon}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </OutsidePressHandler>

      {/* Блок управления записью */}
      {/* <RecordingControl
        isVisible={isRecordingVisible}
        isPaused={isPaused}
        recordingTime={recordingTime}
        error={error}
        onPause={handlePauseRecording}
        onResume={handleResumeRecording}
        onStop={handleStopRecording}
      /> */}
    </>
  );
};

export default AttachmentsPopup;
