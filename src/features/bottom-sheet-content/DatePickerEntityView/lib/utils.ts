/**
 * Форматирует дату в формат ISO
 * @param date Дата в формате YYYY-MM-DD
 * @returns Дата в формате ISO или null
 */
export const formatToISODate = (date: string | null): string | null => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Форматирует дату из ISO в формат YYYY-MM-DD
 * @param isoDate Дата в формате ISO
 * @returns Дата в формате YYYY-MM-DD или null
 */
export const formatFromISODate = (
  isoDate: string | null | undefined
): string | null => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

/**
 * Создает объект с отмеченными датами для календаря
 * @param startDate Начальная дата
 * @param endDate Конечная дата
 * @param primaryColor Основной цвет
 * @param whiteColor Белый цвет
 * @param contrastColor Контрастный цвет
 * @returns Объект с отмеченными датами
 */
export const createMarkedDates = (
  startDate: string | null,
  endDate: string | null,
  primaryColor: string,
  whiteColor: string,
  contrastColor: string
): Record<string, any> => {
  const marked: Record<string, any> = {};

  if (startDate) {
    marked[startDate] = {
      startingDay: true,
      color: primaryColor,
      textColor: whiteColor,
    };
  }

  if (endDate) {
    marked[endDate] = {
      endingDay: true,
      color: primaryColor,
      textColor: whiteColor,
    };
  }

  // Если выбраны обе даты, отмечаем промежуточные даты
  if (startDate && endDate && startDate !== endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Проверяем, что startDate раньше endDate
    if (start < end) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + 1);

      while (currentDate < end) {
        const dateString = formatFromISODate(currentDate.toISOString());
        if (dateString) {
          marked[dateString] = {
            color: `${primaryColor}40`, // Добавляем прозрачность к основному цвету
            textColor: contrastColor,
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  return marked;
};
