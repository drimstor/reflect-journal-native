/**
 * Утилиты для работы с timestamp
 * Все даты хранятся как числа (миллисекунды с 1970-01-01 UTC)
 * Автоматически отображаются в локальной таймзоне пользователя
 */

/**
 * Текущий timestamp в миллисекундах
 */
export const getCurrentDateTime = (): number => {
  return Date.now();
};

/**
 * Нормализует любую дату к timestamp
 */
export const normalizeDate = (
  date: Date | string | number | null | undefined
): number | undefined => {
  if (!date) return undefined;

  if (typeof date === "number") {
    return date; // Уже timestamp
  }

  if (typeof date === "string") {
    return new Date(date).getTime();
  }

  if (date instanceof Date) {
    return date.getTime();
  }

  return undefined;
};

/**
 * Форматирует timestamp для начала дня (00:00:00 в локальной таймзоне)
 */
export const formatStartDate = (
  dateString: string | null | undefined
): number | undefined => {
  if (!dateString) return undefined;

  const date = new Date(dateString + "T00:00:00");
  return date.getTime();
};

/**
 * Форматирует timestamp для конца дня (23:59:59 в локальной таймзоне)
 */
export const formatEndDate = (
  dateString: string | null | undefined
): number | undefined => {
  if (!dateString) return undefined;

  const date = new Date(dateString + "T23:59:59");
  return date.getTime();
};

/**
 * Форматирует период дат в timestamp
 */
export const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  return {
    startDate: formatStartDate(startDate),
    endDate: formatEndDate(endDate),
  };
};

/**
 * Форматирует timestamp для отображения пользователю
 */
export const formatDateForDisplay = (
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
): string => {
  return new Date(timestamp).toLocaleDateString("ru-RU", options);
};

/**
 * Конвертирует timestamp в ISO строку (для отладки)
 */
export const timestampToISO = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};

/**
 * Конвертирует timestamp в формат YYYY-MM-DD для календаря
 */
export const timestampToDateString = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split("T")[0];
};

/**
 * Конвертирует строку YYYY-MM-DD в timestamp (начало дня)
 */
export const dateStringToTimestamp = (dateString: string): number => {
  return new Date(dateString + "T00:00:00").getTime();
};

/**
 * Добавляет дни к timestamp
 */
export const addDays = (timestamp: number, days: number): number => {
  return timestamp + days * 24 * 60 * 60 * 1000;
};

/**
 * Добавляет часы к timestamp
 */
export const addHours = (timestamp: number, hours: number): number => {
  return timestamp + hours * 60 * 60 * 1000;
};

// Алиасы для совместимости
export const formatDateForAPI = normalizeDate;
export const getCurrentUTCDateTime = getCurrentDateTime;
