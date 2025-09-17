import { useSpeechRecognition } from "@/src/features/chat/AttachmentsPopup/lib/hooks/useSpeechRecognition";
import { useThemeStore } from "@/src/shared/store";
import { MicrophoneIcon } from "@/src/shared/ui/icons";
import { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { createStyles } from "./AudioRecorder.styles";

interface AudioRecorderProps {
  onSpeechRecognized?: (text: string) => void;
  size?: number;
}

const AudioRecorder: FC<AudioRecorderProps> = ({
  onSpeechRecognized,
  size = 60,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors, size);

  // Используем хук для распознавания речи
  const { isListening, startListening, stopListening } =
    useSpeechRecognition(onSpeechRecognized);

  const handlePress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <TouchableOpacity style={[styles.container]} onPress={handlePress}>
      <View
        style={[styles.iconWrapper, isListening && styles.iconWrapperActive]}
      >
        <MicrophoneIcon
          color={isListening ? colors.error : colors.contrast}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AudioRecorder;
