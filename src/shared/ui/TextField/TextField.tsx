import { FC, memo, ReactNode } from "react";
import { View, TextInput } from "react-native";
import { PaletteColor } from "@/src/shared/model/types";
import Text from "../Text/Text";
import { createStyles, sizeStyles } from "./TextField.styles";
import { useThemeStore } from "@/src/shared/store";
import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";

interface TextFieldProps {
  value: string;
  label?: string;
  editable?: boolean;
  multiline?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
  stateType?: null | "success" | "error";
  helperText?: string;
  phone?: boolean;
  width?: number | string;
  keyboardType?: "numeric" | "default";
  backgroundColor: PaletteColor;
  startIcon?: ReactNode;
  size?: "small" | "medium";
  secureTextEntry?: boolean;
  labelColor?: PaletteColor;
  placeholderColor?: PaletteColor;
  textColor?: PaletteColor;
  helperTextColor?: PaletteColor;
}

const TextField: FC<TextFieldProps> = ({
  value,
  label,
  editable = true,
  multiline = false,
  onChangeText,
  placeholder,
  stateType = null,
  helperText,
  phone = false,
  backgroundColor,
  startIcon,
  size = "medium",
  secureTextEntry = false,
  labelColor,
  placeholderColor,
  textColor,
  helperTextColor,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const contrastTextColor = getContrastColor("#FFF");

  return (
    <View style={styles.textFieldWrapper}>
      {label && (
        <Text size="medium" color={labelColor ?? colors.contrast}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.textFieldContainer,
          { backgroundColor },
          sizeStyles[size],
          multiline && styles.multiline,
        ]}
      >
        {startIcon ?? null}
        <TextInput
          secureTextEntry={secureTextEntry}
          style={styles.textField}
          maxLength={phone ? 10 : undefined}
          value={phone ? value.replace(/[^0-9]/g, "") : value}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor ?? colors.contrast + 50}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={phone ? "numeric" : "default"}
          textContentType={phone ? "telephoneNumber" : undefined}
        />
      </View>
      {helperText && (
        <Text size="small" color={helperTextColor ?? colors.contrast}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default TextField;
