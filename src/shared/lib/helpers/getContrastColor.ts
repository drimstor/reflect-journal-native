export const getContrastColor = (backgroundColor: string): string => {
  if (!backgroundColor) return "#181822";
  // Убираем # если есть и конвертируем в RGB
  const hex = backgroundColor?.replace("#", "");

  // Получаем RGB компоненты
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Вычисляем яркость по формуле YIQ
  // Эта формула учитывает восприятие яркости человеческим глазом
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Возвращаем черный или белый в зависимости от яркости фона
  return yiq >= 128 ? "#181822" : "#FDFDFD";
};
