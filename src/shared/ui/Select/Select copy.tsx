import { useThemeStore } from "@/src/shared/store";
import { Picker } from "@react-native-picker/picker";
import { FC, memo } from "react";
import { View } from "react-native";
import Text from "../Text/Text";
import { SelectProps } from "./model/types";
import { createStyles } from "./Select.styles";

const Select: FC<SelectProps> = ({
  value,
  label,
  placeholder,
  helperText,
  backgroundColor,
  labelColor,
  helperTextColor,
  required,
  options = [],
  onValueChange,
  enabled = true,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.selectWrapper}>
      {label && (
        <Text size="medium" color={labelColor ?? colors.contrast}>
          {label}
          {required && <Text color={colors.error}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.selectContainer,
          { backgroundColor: backgroundColor ?? colors.secondary },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={enabled}
          style={[
            styles.picker,
            { backgroundColor: backgroundColor ?? colors.secondary },
          ]}
          dropdownIconColor={colors.contrast}
          mode={"dropdown"}
        >
          {placeholder && (
            <Picker.Item
              label={placeholder}
              value=""
              color={colors.contrast + "80"}
              style={{ backgroundColor: colors.secondary }}
            />
          )}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={colors.contrast}
              style={{ backgroundColor: colors.secondary }}
            />
          ))}
        </Picker>
      </View>
      {helperText && (
        <Text
          size="small"
          color={helperTextColor ?? colors.contrast}
          style={styles.helperText}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default memo(Select);
