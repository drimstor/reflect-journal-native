import { BottomSheet, List } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useBottomSheetVisibility } from "./lib/hooks/useBottomSheetVisibility";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";

const BottomSheetActions = () => {
  const { colors } = useThemeStore();
  const { ref, handleClose } = useBottomSheetVisibility();
  const { actions, resetActions } = useBottomSheetStore();

  const handleAction = (action: () => void = () => {}) => {
    handleClose();
    resetActions();
    action();
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[actions.length * 52 + 53]}
      backgroundColor={colors.secondary}
      borderColor={colors.alternate}
      animateOnMount={false}
      style={{ paddingTop: 0 }}
      initialIndex={-1}
      indicatorColor={colors.alternate}
      withBackdrop
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
