import type { MonthYearValue } from "../../model/types";

/**
 * Конвертирует timestamp в MonthYearValue
 * @param timestamp - Unix timestamp в миллисекундах (int64)
 * @returns Объект MonthYearValue с днем, месяцем и годом
 */
export const timestampToMonthYearValue = (
  timestamp?: number
): MonthYearValue => {
  if (!timestamp) return {};

  const date = new Date(timestamp);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

/**
 * Конвертирует MonthYearValue в timestamp
 * @param value - Объект MonthYearValue
 * @returns Unix timestamp в миллисекундах (int64) или undefined если недостаточно данных
 */
export const monthYearValueToTimestamp = (
  value: MonthYearValue
): number | undefined => {
  if (!value.year || !value.month) return undefined;

  const day = value.day || 1;
  const date = new Date(value.year, value.month - 1, day);
  return date.getTime();
};

/**
 * Конвертирует MonthYearValue в объект Date
 * @param value - Объект MonthYearValue
 * @returns Date объект или null если недостаточно данных
 */
export const monthYearValueToDate = (value: MonthYearValue): Date | null => {
  if (!value.year || !value.month) return null;

  const day = value.day || 1;
  return new Date(value.year, value.month - 1, day);
};

/**
 * Конвертирует Date в MonthYearValue
 * @param date - Date объект
 * @returns Объект MonthYearValue
 */
export const dateToMonthYearValue = (date: Date): MonthYearValue => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

/**
 * Проверяет, является ли MonthYearValue пустым
 * @param value - Объект MonthYearValue
 * @returns true если объект пустой (нет года и месяца)
 */
export const isMonthYearValueEmpty = (value: MonthYearValue): boolean => {
  return !value.year && !value.month && !value.day;
};

/**
 * Проверяет, является ли MonthYearValue полным (содержит все поля)
 * @param value - Объект MonthYearValue
 * @returns true если объект содержит день, месяц и год
 */
export const isMonthYearValueComplete = (value: MonthYearValue): boolean => {
  return Boolean(value.day && value.month && value.year);
};

/**
 * Форматирует MonthYearValue в строку
 * @param value - Объект MonthYearValue
 * @param format - Формат вывода ('short' | 'long')
 * @returns Отформатированная строка даты
 */
export const formatMonthYearValue = (
  value: MonthYearValue,
  format: "short" | "long" = "short"
): string => {
  if (isMonthYearValueEmpty(value)) return "";

  const parts: string[] = [];

  if (value.day) parts.push(value.day.toString().padStart(2, "0"));
  if (value.month) {
    if (format === "long") {
      const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      parts.push(monthNames[value.month - 1]);
    } else {
      parts.push(value.month.toString().padStart(2, "0"));
    }
  }
  if (value.year) parts.push(value.year.toString());

  return format === "long" ? parts.join(" ") : parts.join(".");
};
