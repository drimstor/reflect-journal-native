import { FC, lazy } from "react";
import { Platform } from "react-native";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onImagePickerPress?: () => void;
  onSpeechRecognized?: (text: string) => void; // Обработчик распознанного текста
}

// Динамический импорт компонентов по платформе
const AttachmentsPopupAndroid = lazy(
  () => import("./AttachmentsPopup.android")
);
const AttachmentsPopupIOS = lazy(() => import("./AttachmentsPopup.ios"));

const AttachmentsPopup: FC<AttachmentsPopupProps> = (props) => {
  if (Platform.OS === "android") {
    return <AttachmentsPopupAndroid {...props} />;
  }
  if (Platform.OS === "ios") {
    return <AttachmentsPopupIOS {...props} />;
  }
  return null;
};

export default AttachmentsPopup;
