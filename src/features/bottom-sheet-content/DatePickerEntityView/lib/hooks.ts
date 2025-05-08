import { useState, useEffect, useCallback } from "react";
import { DateData, LocaleConfig } from "react-native-calendars";
import { createMarkedDates } from "./utils";

/**
 * Хук для управления локализацией календаря
 * @param locale Текущая локаль
 */
export const useCalendarLocalization = (locale: string) => {
  useEffect(() => {
    LocaleConfig.defaultLocale = locale;
  }, [locale]);
};

/**
 * Хук для управления выбором дат
 * @param initialStartDate Начальная дата
 * @param initialEndDate Конечная дата
 * @param primaryColor Основной цвет
 * @param whiteColor Белый цвет
 * @param contrastColor Контрастный цвет
 */
export const useDateSelection = (
  initialStartDate: string | null,
  initialEndDate: string | null,
  primaryColor: string,
  whiteColor: string,
  contrastColor: string
) => {
  // Локальное состояние для выбранных дат
  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  // Обновляем markedDates при изменении startDate или endDate
  useEffect(() => {
    const marked = createMarkedDates(
      startDate,
      endDate,
      primaryColor,
      whiteColor,
      contrastColor
    );
    setMarkedDates(marked);
  }, [startDate, endDate, primaryColor, whiteColor, contrastColor]);

  // Обработчик выбора даты
  const handleDayPress = useCallback(
    (day: DateData) => {
      const selectedDate = day.dateString;

      if (!startDate || (startDate && endDate)) {
        // Если не выбрана начальная дата или выбраны обе даты, устанавливаем начальную дату
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        // Если выбрана только начальная дата
        const start = new Date(startDate);
        const selected = new Date(selectedDate);

        if (selected < start) {
          // Если выбранная дата раньше начальной, меняем их местами
          setEndDate(startDate);
          setStartDate(selectedDate);
        } else {
          // Иначе устанавливаем конечную дату
          setEndDate(selectedDate);
        }
      }
    },
    [startDate, endDate]
  );

  // Обработчик сброса дат
  const handleReset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    markedDates,
    handleDayPress,
    handleReset,
    setStartDate,
    setEndDate,
  };
};
