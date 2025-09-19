import { View } from "react-native";
import { useThemeStore } from "../../store";
import { createStaticBackdropStyles } from "./BottomSheet.styles";

const BottomSheetStaticBackdrop = () => {
  const { colors } = useThemeStore();
  const styles = createStaticBackdropStyles(colors);

  return <View style={styles.bottomSheetStaticBackdrop} />;
};

export default BottomSheetStaticBackdrop;
