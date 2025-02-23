import { BottomSheet, List } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import type { BottomSheetActionsProps } from "./model/types";
import { useBottomSheetVisibility } from "./lib/hooks/useBottomSheetVisibility";

const BottomSheetActions = ({ items }: BottomSheetActionsProps) => {
  const { colors } = useThemeStore();
  const { ref, handleClose } = useBottomSheetVisibility();

  const handleAction = (action: () => void = () => {}) => {
    handleClose();
    action();
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[200]}
      backgroundColor={colors.secondary}
      borderColor={colors.alternate}
      animateOnMount={false}
      style={{ paddingTop: 0 }}
      initialIndex={-1}
      indicatorColor={colors.alternate}
      withBackdrop
      onClose={handleClose}
    >
      <List
        style={{ paddingBottom: 40 }}
        items={items.map(({ text, IconComponent, onPress, iconColor }) => ({
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
