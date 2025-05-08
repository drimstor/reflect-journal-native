import React, { useEffect, useRef } from "react";
import { View, TextInput, Pressable, TextInputProps } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { PlusIcon } from "@/src/shared/ui/icons";
import { FONTS } from "@/src/shared/const";
import { useT } from "@/src/shared/lib/hooks";
import { styles } from "./FilterInput.styles";

interface FilterInputProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerStyle?: any;
  inputStyle?: any;
  placeholder?: string;
}

const FilterInput = React.memo(
  ({
    value,
    onChangeText,
    onClear,
    containerStyle,
    inputStyle,
    placeholder,
    ...props
  }: FilterInputProps) => {
    const t = useT();
    const { colors } = useThemeStore();
    const inputRef = useRef<TextInput>(null);

    // Управление фокусом при изменении состояния расширения
    useEffect(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, []);

    const handleClear = () => {
      onChangeText("");
      onClear?.();
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: colors.contrast },
            {
              maxWidth: "92%",
              fontSize: 16,
              fontFamily: FONTS.regular,
            },
            inputStyle,
          ]}
          value={value}
          maxLength={40}
          placeholder={placeholder}
          placeholderTextColor={colors.contrast + "80"}
          onChangeText={onChangeText}
          keyboardType={"default"}
          {...props}
        />
        {value && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <PlusIcon size={26} color={colors.contrast} />
          </Pressable>
        )}
      </View>
    );
  }
);

export default FilterInput;
