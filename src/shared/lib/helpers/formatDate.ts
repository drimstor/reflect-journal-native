export const formatDate = (dateString: string, locale: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
};

export const getWeekDay = (
  date: string,
  t: Function,
  dayType: "long" | "short"
) => {
  if (!date) return "";
  const days = [
    t(`shared.date.${dayType}Days.Sunday`),
    t(`shared.date.${dayType}Days.Monday`),
    t(`shared.date.${dayType}Days.Tuesday`),
    t(`shared.date.${dayType}Days.Wednesday`),
    t(`shared.date.${dayType}Days.Thursday`),
    t(`shared.date.${dayType}Days.Friday`),
    t(`shared.date.${dayType}Days.Saturday`),
  ];
  return days[new Date(date).getDay()];
};
