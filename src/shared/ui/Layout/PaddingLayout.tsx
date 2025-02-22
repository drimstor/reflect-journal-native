import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { paddingStyles } from "./Layout.styles";
import { useGetPadding } from "@/src/shared/lib/hooks";

interface PaddingLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const PaddingLayout: FC<PaddingLayoutProps> = ({ children, style }) => {
  const { paddingHorizontal } = useGetPadding();

  return (
    <View style={[paddingStyles.paddingWrapper, style, { paddingHorizontal }]}>
      {children}
    </View>
  );
};

export default PaddingLayout;
