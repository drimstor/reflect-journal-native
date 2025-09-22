import { useT } from "@/src/shared/lib/hooks";
import { FC, memo, useMemo } from "react";
import { View } from "react-native";
import { useThemeStore } from "../../store";
import Select from "../Select/Select";
import Text from "../Text/Text";
import { createStyles } from "./MonthYearPicker.styles";
import { MonthYearPickerProps, MonthYearValue } from "./model/types";

const MonthYearPicker: FC<MonthYearPickerProps> = ({
  value = {},
  label,
  helperText,
  backgroundColor,
  labelColor,
  helperTextColor,
  required,
  onValueChange,
  enabled = true,
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
  }, [t]);

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

      <View style={styles.selectsContainer}>
        {showDay && (
          <View style={[styles.selectWrapper, styles.daySelect]}>
            <Select
              value={value.day?.toString() || ""}
              placeholder={placeholders?.day}
              options={dayOptions}
              onValueChange={handleDayChange}
              backgroundColor={backgroundColor}
              enabled={enabled}
            />
          </View>
        )}

        {showMonth && (
          <View style={[styles.selectWrapper, styles.monthSelect]}>
            <Select
              value={value.month?.toString() || ""}
              placeholder={placeholders?.month}
              options={monthOptions}
              onValueChange={handleMonthChange}
              backgroundColor={backgroundColor}
              enabled={enabled}
              // style={{ selectContainer: { borderColor: "transparent" } }}
            />
          </View>
        )}

        {showYear && (
          <View style={[styles.selectWrapper, styles.yearSelect]}>
            <Select
              value={value.year?.toString() || ""}
              placeholder={placeholders?.year}
              options={yearOptions}
              onValueChange={handleYearChange}
              backgroundColor={backgroundColor}
              enabled={enabled}
            />
          </View>
        )}
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

export default memo(MonthYearPicker);
