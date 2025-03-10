import { BottomSheet, List, TextField } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useBottomSheetVisibility } from "./lib/hooks/useBottomSheetVisibility";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { useKeyboard } from "../../lib/hooks/useKeyboard";
import { useCallback } from "react";

const BottomSheetActions = () => {
  const { colors } = useThemeStore();
  const { ref, handleClose } = useBottomSheetVisibility();
  const { actions, resetActions } = useBottomSheetStore();

  const handleAction = (action: () => void = () => {}) => {
    handleClose();
    resetActions();
    action();
  };

  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const getSnapPoints = useCallback(() => {
    const baseHeight = actions.length * 52 + 53;
    return [baseHeight + (isKeyboardVisible ? keyboardHeight : 0)];
  }, [keyboardHeight, isKeyboardVisible, actions.length]);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={getSnapPoints()}
      backgroundColor={colors.secondary}
      borderColor={colors.alternate}
      animateOnMount={false}
      initialIndex={-1}
      indicatorColor={colors.alternate}
      withBackdrop
      enableBackdropDismiss={!actions.length}
      onClose={() => {
        handleClose();
        resetActions();
      }}
    >
      <List
        style={{ paddingBottom: 40 }}
        items={actions.map(({ text, IconComponent, onPress, iconColor }) => ({
          text,
          onPress: () => handleAction(onPress),
          IconComponent: (props) => (
            <IconComponent {...props} color={iconColor || props.color} />
          ),
        }))}
      />
    </BottomSheet>
  );
};

export default BottomSheetActions;
