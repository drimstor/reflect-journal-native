import { FC, lazy } from "react";
import { Platform } from "react-native";

interface AudioRecorderProps {
  onSpeechRecognized?: (text: string) => void;
  size?: number;
}

// Динамический импорт компонентов по платформе
const AudioRecorderAndroid = lazy(() => import("./AudioRecorder.android"));
const AudioRecorderIOS = lazy(() => import("./AudioRecorder.ios"));

export const AudioRecorder: FC<AudioRecorderProps> = (props) => {
  if (Platform.OS === "android") {
    return <AudioRecorderAndroid {...props} />;
  }
  if (Platform.OS === "ios") {
    return <AudioRecorderIOS {...props} />;
  }
  return null;
};
