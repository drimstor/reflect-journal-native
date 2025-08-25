import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import React from "react";
import { StyleProp, Switch, View, ViewStyle } from "react-native";
import { styles } from "./Toggle.styles";

export interface ToggleProps {
  label?: string | React.ReactNode; // Текст рядом с переключателем
  value: boolean; // Текущее значение
  onValueChange: (value: boolean) => void; // Обработчик изменения
  disabled?: boolean; // Отключен ли переключатель
  size?: "small" | "medium" | "large"; // Размер переключателя
  trackColor?: {
    false?: string;
    true?: string;
  }; // Цвета трека
  thumbColor?: string; // Цвет ползунка
  style?: Record<string, StyleProp<ViewStyle>>;
}

/**
 * Переиспользуемый компонент переключателя с настраиваемым внешним видом
 */
export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  size = "medium",
  trackColor,
  thumbColor,
  style,
}) => {
  const { colors } = useThemeStore();

  // Определяем размеры в зависимости от size
  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
      case "large":
        return { transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] };
      default:
        return { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] };
    }
  };

  // Определяем цвета трека
  const defaultTrackColor = {
    false: colors.alternate,
    true: colors.accent,
    ...trackColor,
  };

  const toggleElement = (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={defaultTrackColor}
      thumbColor={thumbColor}
      style={[
        styles.toggle,
        getSizeStyle(),
        {
          borderColor: colors.alternate,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    />
  );

  // Если нет лейбла, возвращаем только переключатель
  if (!label) {
    return toggleElement;
  }

  return (
    <View style={[styles.container, style?.container]}>
      <Text
        color={colors.contrast}
        style={[styles.label, disabled && styles.disabledLabel]}
      >
        {label}
      </Text>
      {toggleElement}
    </View>
  );
};

export default Toggle;
