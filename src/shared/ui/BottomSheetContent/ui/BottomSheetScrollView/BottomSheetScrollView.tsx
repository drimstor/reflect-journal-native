import { useKeyboard } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { useMemo } from "react";
import { ScrollView } from "react-native";

export const BottomSheetScrollView = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { window } = useDeviceStore();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const maxHeight = useMemo(
    () => (isKeyboardVisible ? window.height - keyboardHeight - 135 : "auto"),
    [isKeyboardVisible, window.height, keyboardHeight]
  );

  const paddingBottom = useMemo(
    () => (isKeyboardVisible ? 15 : 0),
    [isKeyboardVisible]
  );

  return (
    <ScrollView style={{ maxHeight, paddingBottom }}>{children}</ScrollView>
  );
};
