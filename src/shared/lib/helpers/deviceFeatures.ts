/**
 * Функции для определения особенностей устройства
 */

/**
 * Модели iPhone с Dynamic Island
 * Источники:
 * - https://gist.github.com/adamawolf/3048717
 * - https://deviceatlas.com/resources/clientside/ios-hardware-identification
 * - https://support.apple.com/en-us/108044
 */
const DYNAMIC_ISLAND_MODELS = [
  // Технические идентификаторы
  // iPhone 14 Pro и Pro Max (2022)
  "iPhone15,2", // iPhone 14 Pro
  "iPhone15,3", // iPhone 14 Pro Max

  // iPhone 15 все модели (2023)
  "iPhone15,4", // iPhone 15
  "iPhone15,5", // iPhone 15 Plus
  "iPhone16,1", // iPhone 15 Pro
  "iPhone16,2", // iPhone 15 Pro Max

  // iPhone 16 все модели (2024)
  "iPhone17,1", // iPhone 16 Pro
  "iPhone17,2", // iPhone 16 Pro Max
  "iPhone17,3", // iPhone 16
  "iPhone17,4", // iPhone 16 Plus

  // Маркетинговые названия для дополнительной проверки
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",

  "Simulator iOS",
];

/**
 * Проверяет, имеет ли устройство Dynamic Island
 * @param brand Бренд устройства
 * @param model Модель устройства
 * @returns true, если устройство имеет Dynamic Island
 */
export const hasDynamicIsland = (brand: string, model: string): boolean => {
  // Dynamic Island есть только на iPhone
  if (!brand || brand.toLowerCase() !== "apple") {
    return false;
  }

  // Проверяем модель по списку
  return DYNAMIC_ISLAND_MODELS.some(
    (diModel) => model.includes(diModel) || model === diModel
  );
};

/**
 * Проверяет, имеет ли устройство "челку" (notch)
 * @param brand Бренд устройства
 * @param model Модель устройства
 * @returns true, если устройство имеет notch
 */
export const hasNotch = (brand: string, model: string): boolean => {
  // Если устройство имеет Dynamic Island, то у него нет notch
  if (hasDynamicIsland(brand, model)) {
    return false;
  }

  // iPhone с notch (начиная с iPhone X)
  if (brand && brand.toLowerCase() === "apple") {
    // iPhone X, XR, XS, XS Max
    if (model.includes("iPhone10,") || model.includes("iPhone11,")) {
      return true;
    }

    // iPhone 11, 11 Pro, 11 Pro Max
    if (model.includes("iPhone12,") && !model.includes("iPhone12,8")) {
      // исключаем iPhone SE 2nd gen
      return true;
    }

    // iPhone 12, 12 mini, 12 Pro, 12 Pro Max
    if (model.includes("iPhone13,")) {
      return true;
    }

    // iPhone 13, 13 mini, 13 Pro, 13 Pro Max
    if (model.includes("iPhone14,") && !model.includes("iPhone14,6")) {
      // исключаем iPhone SE 3rd gen
      return true;
    }

    // iPhone 14, 14 Plus (не Pro модели)
    if (model.includes("iPhone14,7") || model.includes("iPhone14,8")) {
      return true;
    }

    // Проверка по маркетинговым названиям
    if (
      model.includes("iPhone X") ||
      model.includes("iPhone XR") ||
      model.includes("iPhone XS") ||
      model.includes("iPhone 11") ||
      model.includes("iPhone 12") ||
      model.includes("iPhone 13") ||
      (model.includes("iPhone 14") && !model.includes("iPhone 14 Pro"))
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Проверяет, является ли устройство iPhone
 * @param brand Бренд устройства
 * @returns true, если устройство - iPhone
 */
export const isIPhone = (brand: string): boolean => {
  return Boolean(brand && brand.toLowerCase() === "apple");
};

/**
 * Получает тип выреза экрана устройства
 * @param brand Бренд устройства
 * @param model Модель устройства
 * @returns Тип выреза экрана: "dynamic-island", "notch", "none"
 */
export const getDeviceDisplayCutoutType = (
  brand: string,
  model: string
): "dynamic-island" | "notch" | "none" => {
  if (hasDynamicIsland(brand, model)) {
    return "dynamic-island";
  }

  if (hasNotch(brand, model)) {
    return "notch";
  }

  return "none";
};
