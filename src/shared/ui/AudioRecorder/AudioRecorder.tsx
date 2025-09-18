import React, { FC, lazy, Suspense } from "react";
import { Platform } from "react-native";

interface AudioRecorderProps {
  onSpeechRecognized?: (text: string) => void;
  size?: number;
}

// Динамический импорт компонентов по платформе
const AudioRecorderAndroid = lazy(() => import("./AudioRecorder.android"));
const AudioRecorderIOS = lazy(() => import("./AudioRecorder.ios"));

const AudioRecorderContainer: FC<AudioRecorderProps> = (props) => {
  const Component =
    Platform.OS === "android" ? AudioRecorderAndroid : AudioRecorderIOS;

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default AudioRecorderContainer;
