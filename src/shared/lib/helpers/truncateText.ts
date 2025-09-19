/**
 * Обрезает текст до указанной длины и добавляет многоточие
 * @param text - Исходный текст для обрезания
 * @param maxLength - Максимальная длина текста (по умолчанию 20)
 * @param ellipsis - Символ многоточия (по умолчанию "...")
 * @returns Обрезанный текст с многоточием или исходный текст, если он короче maxLength
 */
export const truncateText = (
  text: string,
  maxLength: number = 18,
  ellipsis: string = "..."
): string => {
  // Проверяем, что текст не пустой
  if (!text || typeof text !== "string") {
    return "";
  }

  // Удаляем лишние пробелы в начале и конце
  const trimmedText = text.trim();

  // Если текст короче или равен максимальной длине, возвращаем как есть
  if (trimmedText.length <= maxLength) {
    return trimmedText;
  }

  // Обрезаем текст и добавляем многоточие
  return (trimmedText.substring(0, maxLength) + ellipsis).trim();
};
