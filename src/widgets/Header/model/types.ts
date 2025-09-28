import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: {
    icon: ReactNode;
    onPress: () => void;
  };
  rightIcon?: {
    icon: ReactNode;
    onPress: () => void;
  };
  backButton?: boolean;
  centerElement?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
