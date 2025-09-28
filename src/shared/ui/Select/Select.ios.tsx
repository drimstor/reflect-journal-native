import { useThemeStore } from "@/src/shared/store";
import { Picker } from "@react-native-picker/picker";
import { FC, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { ArrowLeftIcon } from "../icons";
import Text from "../Text/Text";
import { SelectProps } from "./model/types";
import { createStyles, sizeStyles } from "./Select.ios.styles";

const SelectIOS: FC<SelectProps> = ({
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
  size = "medium",
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  // Состояние раскрытия
  const [isExpanded, setIsExpanded] = useState(false);

  // Анимация для высоты и поворота стрелки
  const previewHeight = sizeStyles[size].height;
  const heightAnim = useRef(new Animated.Value(previewHeight)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Получаем текст выбранной опции
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption && placeholder;

  // Обработчик переключения состояния
  const toggleExpanded = () => {
    if (!enabled) return;

    const toValue = isExpanded ? 0 : 1;
    const duration = 300;

    // Высота превью секции + высота picker'а
    const previewHeight = sizeStyles[size].height;
    const pickerHeight = 178;
    const collapsedHeight = previewHeight;
    const expandedHeight = previewHeight + pickerHeight;

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? collapsedHeight : expandedHeight,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  // Обработчик выбора значения
  const handleValueChange = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    // Не сворачиваем автоматически - пользователь сам решает когда закрыть
  };

  // Стили для поворота стрелки
  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.selectWrapper}>
      {label && (
        <Text size="medium" color={labelColor ?? colors.contrast}>
          {label}
          {required && <Text color={colors.error}> *</Text>}
        </Text>
      )}

      {/* Анимированный контейнер */}
      <Animated.View
        style={[
          styles.animatedContainer,
          sizeStyles[size],
          {
            height: heightAnim,
            backgroundColor: backgroundColor ?? colors.lightGray,
          },
        ]}
      >
        <Pressable
          style={styles.pressableContainer}
          onPress={toggleExpanded}
          disabled={!enabled}
        >
          {/* Секция превью */}
          <View style={[styles.previewSection, sizeStyles[size]]}>
            <Text
              style={[
                isPlaceholder ? styles.previewPlaceholder : styles.previewText,
              ]}
            >
              {displayText}
            </Text>

            <Animated.View
              style={[
                styles.arrowIcon,
                {
                  transform: [
                    { rotate: "-90deg" }, // Базовый поворот для стрелки вниз
                    { rotate: arrowRotation },
                  ],
                },
              ]}
            >
              <ArrowLeftIcon size={16} color={colors.contrast + 80} />
            </Animated.View>
          </View>
        </Pressable>
        {/* Секция с Picker (показывается только при раскрытии) */}
        {
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={handleValueChange}
              enabled={enabled}
              style={[
                styles.picker,
                { backgroundColor: backgroundColor ?? colors.lightGray },
              ]}
              itemStyle={[
                styles.picker,
                { backgroundColor: backgroundColor ?? colors.lightGray },
              ]}
              dropdownIconColor="transparent" // Скрываем стандартную стрелку
              mode="dropdown"
            >
              {placeholder && (
                <Picker.Item
                  label={placeholder}
                  value=""
                  color={colors.contrast + "80"}
                  style={{
                    backgroundColor: backgroundColor ?? colors.lightGray,
                  }}
                />
              )}
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={colors.contrast}
                  style={{
                    backgroundColor: backgroundColor ?? colors.lightGray,
                  }}
                />
              ))}
            </Picker>
          </View>
        }
      </Animated.View>

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

export default SelectIOS;
