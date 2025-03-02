import { FC, memo } from "react";
import { View, TextInput, Pressable, Platform } from "react-native";
import Text from "../Text/Text";
import { createStyles, sizeStyles } from "./TextField.styles";
import { useThemeStore } from "@/src/shared/store";
import { EyeIcon, EyeSlashIcon } from "../icons";
import { useToggle } from "../../lib/hooks";
import { TextFieldProps } from "./model/types";

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
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors);
  const { value: showPassword, toggle: toggleShowPassword } = useToggle(false);

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
          secureTextEntry={secureTextEntry ? !showPassword : secureTextEntry}
          style={[
            styles.textField,
            secureTextEntry && { paddingRight: 50 },
            // Явно указываем цвет текста для Android
            { color: textColor ?? colors.contrast },
          ]}
          maxLength={phone ? 10 : undefined}
          value={phone ? value.replace(/[^0-9]/g, "") : value}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={colors.contrast + "80"}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={phone ? "numeric" : "default"}
          textContentType={
            phone ? "telephoneNumber" : secureTextEntry ? "password" : undefined
          }
        />
        {secureTextEntry && (
          <Pressable onPress={toggleShowPassword}>
            {showPassword ? (
              <EyeIcon color={colors.contrast + 80} size={20} />
            ) : (
              <EyeSlashIcon color={colors.contrast + 80} size={20} />
            )}
          </Pressable>
        )}
      </View>
      {helperText && (
        <Text size="small" color={helperTextColor ?? colors.contrast}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default memo(TextField);
