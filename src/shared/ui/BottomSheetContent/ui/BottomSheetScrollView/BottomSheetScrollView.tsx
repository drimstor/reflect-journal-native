import { useKeyboard } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { useMemo } from "react";
import { ScrollView } from "react-native";

export const BottomSheetScrollView = ({
  children,
  additionalHeight = 135,
  customMaxHeight,
}: {
  children: React.ReactNode;
  customMaxHeight?: number;
  additionalHeight?: number;
}) => {
  const { window } = useDeviceStore();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const maxHeight = useMemo(
    () =>
      isKeyboardVisible
        ? window.height - keyboardHeight - additionalHeight
        : customMaxHeight || "auto",
    [isKeyboardVisible, window.height, keyboardHeight, customMaxHeight]
  );

  const paddingBottom = useMemo(
    () => (isKeyboardVisible ? 15 : 0),
    [isKeyboardVisible]
  );

  return (
    <ScrollView style={{ maxHeight, paddingBottom }}>{children}</ScrollView>
  );
};
