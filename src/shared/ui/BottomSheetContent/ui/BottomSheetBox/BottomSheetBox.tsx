import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";

interface BottomSheetBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BottomSheetBox = ({ children, style }: BottomSheetBoxProps) => {
  const { setBottomSheetHeight } = useBottomSheetStore();

  const handleLayout = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.height > 0) {
      setBottomSheetHeight(e.nativeEvent.layout.height);
    }
  };

  return (
    <View style={style} onLayout={handleLayout}>
      {children}
    </View>
  );
};
