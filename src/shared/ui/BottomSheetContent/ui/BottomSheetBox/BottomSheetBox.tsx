import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";

interface BottomSheetBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const BottomSheetBox = ({ children, style }: BottomSheetBoxProps) => {
  const { setBottomSheetHeight } = useBottomSheetStore();

  const handleLayout = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.height > 0) {
      setBottomSheetHeight(e.nativeEvent.layout.height);
    }
  };

  return (
    <View
      style={[{ gap: 4, paddingBottom: 60 }, style]}
      onLayout={handleLayout}
    >
      {children}
    </View>
  );
};

export default BottomSheetBox;
