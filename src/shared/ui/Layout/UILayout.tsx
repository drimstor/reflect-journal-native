import { FC, ReactNode } from "react";
import { View } from "react-native";
import BottomSheetActions from "../BottomSheetActions/BottomSheetActions";

interface UILayoutProps {
  children: ReactNode;
}

const UILayout: FC<UILayoutProps> = ({ children }) => {
  return (
    <View>
      {children}
      <BottomSheetActions />
    </View>
  );
};

export default UILayout;
