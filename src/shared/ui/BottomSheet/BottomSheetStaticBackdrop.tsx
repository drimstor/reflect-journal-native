import { View } from "react-native";
import { useThemeStore } from "../../store";
import { createStaticBackdropStyles } from "./BottomSheet.styles";

const BottomSheetStaticBackdrop = ({
  startPosition = 85,
}: {
  startPosition?: number;
}) => {
  const { colors } = useThemeStore();
  const styles = createStaticBackdropStyles(colors);

  return (
    <View style={[styles.bottomSheetStaticBackdrop, { top: startPosition }]} />
  );
};

export default BottomSheetStaticBackdrop;
