import { ReactNode } from "react";

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
}
