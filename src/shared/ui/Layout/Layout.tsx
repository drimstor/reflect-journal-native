import { useDeviceStore } from "@/src/shared/store";
import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface LayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Layout: FC<LayoutProps> = ({ children, style }) => {
  const { window } = useDeviceStore();

  return <View style={[{ height: window.height }, style]}>{children}</View>;
};

export default Layout;
