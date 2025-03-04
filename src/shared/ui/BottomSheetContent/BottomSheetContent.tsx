import { BottomSheet, List, TextField } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
// import { useBottomSheetVisibility } from "./lib/hooks/useBottomSheetVisibility";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { useKeyboard } from "../../lib/hooks/useKeyboard";
import { useCallback } from "react";

const BottomSheetContent = () => {
  const { colors } = useThemeStore();
  // const { ref, handleClose } = useBottomSheetVisibility();
  const { actions, resetActions } = useBottomSheetStore();

  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const handleAction = (action: () => void = () => {}) => {
    // handleClose();
    resetActions();
    action();
  };

  const getSnapPoints = useCallback(() => {
    const baseHeight = 200;
    return [baseHeight + (isKeyboardVisible ? keyboardHeight : 0)];
  }, [keyboardHeight, isKeyboardVisible]);

  return (
    <BottomSheet
      // ref={ref}
      snapPoints={getSnapPoints()}
      backgroundColor={colors.secondary}
      borderColor={colors.alternate}
      animateOnMount={false}
      style={{ paddingTop: 16 }}
      staticMode
      // initialIndex={-1}
      initialIndex={0}
      // indicatorColor={colors.alternate}
      // enableBackdropDismiss
      withBackdrop
      onClose={() => {
        // handleClose();
        resetActions();
      }}
    >
      <TextField
        placeholder="Search"
        value={""}
        onChangeText={() => {}}
        backgroundColor={colors.background}
      />
    </BottomSheet>
  );
};

export default BottomSheetContent;
