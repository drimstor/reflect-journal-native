import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface LayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Layout: FC<LayoutProps> = ({ children, style }) => {
  return <View style={[{ height: WINDOW_HEIGHT }, style]}>{children}</View>;
};

export default Layout;
