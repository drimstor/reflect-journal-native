import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
// import { createStyles } from "./Layout.styles";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";

interface LayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Layout: FC<LayoutProps> = ({ children, style }) => {
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();

  return <View style={[{ height: window.height }, style]}>{children}</View>;
};

export default Layout;
