/**
 * Преобразует HEX цвет в объект RGB
 * @param hex HEX цвет
 * @returns Объект с компонентами RGB
 */
const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(
    shorthandRegex,
    (_, r, g, b) => r + r + g + g + b + b
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Преобразует RGB компоненты в HEX цвет
 * @param r Красный компонент (0-255)
 * @param g Зеленый компонент (0-255)
 * @param b Синий компонент (0-255)
 * @returns HEX строка цвета
 */
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Преобразует RGB в HSL
 * @param r Красный компонент (0-255)
 * @param g Зеленый компонент (0-255)
 * @param b Синий компонент (0-255)
 * @returns Объект с компонентами HSL
 */
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Преобразует HSL в RGB
 * @param h Оттенок (0-360)
 * @param s Насыщенность (0-100)
 * @param l Яркость (0-100)
 * @returns Объект с компонентами RGB
 */
const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // ахроматический
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Генерирует цвет для градиента, который хорошо сочетается с исходным цветом
 * @param baseColor Базовый цвет в формате HEX (например, "#FF5733")
 * @param options Дополнительные опции
 * @returns Цвет для градиента в формате HEX
 */
export const getGradientColor = (
  baseColor: string,
  options?: {
    method?: "complement" | "analogous" | "monochromatic" | "split" | "triad";
    intensity?: number; // 0-100, насколько сильное изменение (по умолчанию 20)
  }
) => {
  if (!baseColor) return "#000000";

  const { method = "monochromatic", intensity = 25 } = options || {};

  // Преобразуем HEX в RGB
  const rgb = hexToRgb(baseColor);

  // Преобразуем RGB в HSL для проще манипуляции цветом
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let newHsl = { ...hsl };

  switch (method) {
    case "complement":
      // Комплементарный цвет (противоположный)
      newHsl.h = (hsl.h + 180) % 360;
      break;

    case "analogous":
      // Аналогичный цвет (соседний)
      newHsl.h = (hsl.h + 30) % 360;
      break;

    case "split":
      // Разделенный комплементарный
      newHsl.h = (hsl.h + 150) % 360;
      break;

    case "triad":
      // Триадные цвета
      newHsl.h = (hsl.h + 120) % 360;
      break;

    case "monochromatic":
    default:
      // Монохроматический градиент - меняем только яркость и насыщенность
      newHsl.l = Math.max(Math.min(hsl.l + intensity, 95), 5);
      newHsl.s = Math.max(Math.min(hsl.s + intensity / 2, 100), 0);
      break;
  }

  // Преобразуем обратно в RGB
  const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);

  // Преобразуем RGB в HEX
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};
