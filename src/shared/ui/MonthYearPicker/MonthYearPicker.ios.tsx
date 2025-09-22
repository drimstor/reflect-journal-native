import { useLang, useT } from "@/src/shared/lib/hooks";
import { Picker } from "@react-native-picker/picker";
import { FC, memo, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { useThemeStore } from "../../store";
import { ArrowLeftIcon } from "../icons";
import Text from "../Text/Text";
import { MonthYearPickerProps, MonthYearValue } from "./model/types";
import { createStyles, sizeStyles } from "./MonthYearPicker.ios.styles";

const MonthYearPickerIOS: FC<MonthYearPickerProps> = ({
  value = {},
  label,
  helperText,
  backgroundColor,
  labelColor,
  helperTextColor,
  required,
  onValueChange,
  enabled = true,
  size = "medium",
  showDay = true,
  showMonth = true,
  showYear = true,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  placeholders,
}) => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { locale } = useLang();

  // Состояние раскрытия
  const [isExpanded, setIsExpanded] = useState(false);

  // Анимация для высоты и поворота стрелки
  const previewHeight = sizeStyles[size].height;
  const pickerHeight = 175;
  const heightAnim = useRef(new Animated.Value(previewHeight)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Обработчик переключения состояния
  const toggleExpanded = () => {
    if (!enabled) return;

    const toValue = isExpanded ? 0 : 1;
    const duration = 300;

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

  // Стили для поворота стрелки
  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Форматирование текста превью
  const getPreviewText = () => {
    const parts = [];

    if (showDay && value.day) {
      parts.push(value.day.toString());
    }

    if (showMonth && value.month) {
      parts.push(t(`date.picker.months.${value.month}`));
    }

    if (showYear && value.year) {
      parts.push(value.year.toString());
    }

    if (parts.length === 0) {
      return (
        placeholders?.day ||
        placeholders?.month ||
        placeholders?.year ||
        (locale === "ru" ? "Выберите дату" : "Select date")
      );
    }

    return parts.join(" ");
  };

  const displayText = getPreviewText();
  const isPlaceholder = !value.day && !value.month && !value.year;

  // Генерируем опции для дней (1-31)
  const dayOptions = useMemo(() => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return days;
  }, []);

  // Генерируем опции для месяцев
  const monthOptions = useMemo(() => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        label: t(`date.picker.months.${i}`),
        value: i.toString(),
      });
    }
    return months;
  }, [t, locale]);

  // Генерируем опции для годов
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return years;
  }, [minYear, maxYear]);

  // Обработчики изменения значений
  const handleDayChange = (day: string) => {
    const newValue: MonthYearValue = {
      ...value,
      day: day ? parseInt(day) : undefined,
    };
    onValueChange?.(newValue);
  };

  const handleMonthChange = (month: string) => {
    const newValue: MonthYearValue = {
      ...value,
      month: month ? parseInt(month) : undefined,
    };
    onValueChange?.(newValue);
  };

  const handleYearChange = (year: string) => {
    const newValue: MonthYearValue = {
      ...value,
      year: year ? parseInt(year) : undefined,
    };
    onValueChange?.(newValue);
  };

  return (
    <View style={styles.container}>
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
            backgroundColor: backgroundColor ?? colors.secondary,
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

        {/* Секция с Picker'ами (показывается всегда для анимации) */}
        <View style={styles.pickersContainer}>
          {showDay && (
            <View style={[styles.pickerWrapper, styles.dayPicker]}>
              <Picker
                selectedValue={value.day?.toString() || ""}
                onValueChange={handleDayChange}
                enabled={enabled}
                style={[
                  styles.picker,
                  { backgroundColor: backgroundColor ?? colors.secondary },
                ]}
                itemStyle={styles.picker}
                dropdownIconColor="transparent"
                mode="dropdown"
              >
                {placeholders?.day && (
                  <Picker.Item
                    label={placeholders.day}
                    value=""
                    color={colors.contrast + "80"}
                    style={{ backgroundColor: colors.secondary }}
                  />
                )}
                {dayOptions.map((option) => (
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
          )}

          {showMonth && (
            <View style={[styles.pickerWrapper, styles.monthPicker]}>
              <Picker
                selectedValue={value.month?.toString() || ""}
                onValueChange={handleMonthChange}
                enabled={enabled}
                itemStyle={styles.picker}
                style={[
                  styles.picker,
                  { backgroundColor: backgroundColor ?? colors.secondary },
                ]}
                dropdownIconColor="transparent"
                mode="dropdown"
              >
                {placeholders?.month && (
                  <Picker.Item
                    label={placeholders.month}
                    value=""
                    color={colors.contrast + "80"}
                    style={{ backgroundColor: colors.secondary }}
                  />
                )}
                {monthOptions.map((option) => (
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
          )}

          {showYear && (
            <View style={[styles.pickerWrapper, styles.yearPicker]}>
              <Picker
                selectedValue={value.year?.toString() || ""}
                onValueChange={handleYearChange}
                enabled={enabled}
                itemStyle={styles.picker}
                style={[
                  styles.picker,
                  { backgroundColor: backgroundColor ?? colors.secondary },
                ]}
                dropdownIconColor="transparent"
                mode="dropdown"
              >
                {placeholders?.year && (
                  <Picker.Item
                    label={placeholders.year}
                    value=""
                    color={colors.contrast + "80"}
                    style={{ backgroundColor: colors.secondary }}
                  />
                )}
                {yearOptions.map((option) => (
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
          )}
        </View>
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

export default memo(MonthYearPickerIOS);
