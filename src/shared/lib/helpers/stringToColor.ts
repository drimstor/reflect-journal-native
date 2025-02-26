export const stringToColor = (str: string): string => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color =
    `#${((hash >> 16) & 0xff).toString(16).padStart(2, "0")}` +
    `${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}` +
    `${(hash & 0xff).toString(16).padStart(2, "0")}`;

  return color;
};
