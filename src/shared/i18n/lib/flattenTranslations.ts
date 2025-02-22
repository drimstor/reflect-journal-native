export const flattenTranslations = (
  obj: Record<string, any>,
  prefix = ""
): Record<string, string> => {
  return Object.keys(obj).reduce<Record<string, string>>((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object")
      Object.assign(acc, flattenTranslations(obj[k], pre + k));
    else acc[pre + k] = String(obj[k]);
    return acc;
  }, {});
};
