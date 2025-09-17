import { FC, lazy, Suspense } from "react";
import { Platform } from "react-native";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onImagePickerPress?: () => void;
}

// Динамический импорт компонентов по платформе
const AttachmentsPopupAndroid = lazy(
  () => import("./AttachmentsPopup.android")
);
const AttachmentsPopupIOS = lazy(() => import("./AttachmentsPopup.ios"));

const AttachmentsPopup: FC<AttachmentsPopupProps> = (props) => {
  const Component =
    Platform.OS === "android" ? AttachmentsPopupAndroid : AttachmentsPopupIOS;

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default AttachmentsPopup;
