import { useGetPadding } from "@/src/shared/lib/hooks";
import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface PaddingLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const PaddingLayout: FC<PaddingLayoutProps> = ({ children, style }) => {
  const { paddingHorizontal } = useGetPadding();

  return <View style={[style, { paddingHorizontal }]}>{children}</View>;
};

export default PaddingLayout;
