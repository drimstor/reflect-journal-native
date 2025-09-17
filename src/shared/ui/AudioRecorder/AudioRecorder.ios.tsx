import { useThemeStore } from "@/src/shared/store";
import { MicrophoneIcon } from "@/src/shared/ui/icons";
import { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { createStyles } from "./AudioRecorder.styles";

interface AudioRecorderProps {
  onSpeechRecognized?: (text: string) => void;
  size?: number;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ size = 60 }) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors, size);

  // На iOS пока не поддерживается
  const handlePress = () => {
    console.log("Speech recognition is not supported on iOS yet");
  };

  const isListening = false;

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
