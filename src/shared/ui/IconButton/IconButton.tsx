import { FC, ReactNode, useMemo } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { createStyles } from "./IconButton.styles";
import { useThemeStore } from "@/src/shared/store";

interface IconButtonProps {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isOpacity?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  children,
  onPress,
  style,
  isOpacity = false,
}) => {
  const { colors, theme } = useThemeStore();
  const styles = useMemo(() => createStyles(colors), [theme]);

  return (
    <TouchableOpacity
      activeOpacity={isOpacity ? 0.6 : 1}
      onPress={onPress}
      style={[styles.touchableOpacity, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;
