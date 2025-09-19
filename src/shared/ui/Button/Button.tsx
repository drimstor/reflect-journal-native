import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";
import { PaletteColor } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import { ReactNode } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { SmallLoader } from "../Loader/SmallLoader";
import { createStyles, sizeStyles } from "./Button.styles";
interface ButtonProps {
  children: ReactNode | string;
  onPress: () => void;
  size?: "medium" | "small";
  backgroundColor?: PaletteColor;
  textColor?: PaletteColor;
  flex?: "grow" | "shrink";
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  isDynamicHeight?: boolean;
}
const { primary } = useThemeStore.getState().colors;

const Button = ({
  children,
  onPress,
  size = "medium",
  flex = "grow",
  style,
  backgroundColor = primary,
  textColor,
  disabled = false,
  isLoading,
  isDynamicHeight,
}: ButtonProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const contrastTextColor = getContrastColor(backgroundColor);

  return (
    <TouchableOpacity
      onPress={disabled || isLoading ? undefined : onPress}
      style={[
        styles.buttonWrapper,
        flex === "grow" ? { flexGrow: 1 } : { flexShrink: 1 },
        { backgroundColor },
        size && sizeStyles[size],
        disabled && styles.disabled,
        style && style,
        isDynamicHeight && { maxHeight: "auto" },
      ]}
    >
      {isLoading ? (
        <View style={styles.loaderBox}>
          <SmallLoader color={textColor} />
        </View>
      ) : (
        <Text
          font="bold"
          style={[
            styles.text,
            disabled && styles.disabled,
            { color: textColor ?? contrastTextColor },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
