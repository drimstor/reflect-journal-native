import { MarkdownEmojiTextProps } from "../../model/types";
import { SIZE_MAP } from "../../const/static";

// Получает размер для заголовка на основе уровня и базового размера
export const getHeaderSize = (
  level: number,
  baseSize: MarkdownEmojiTextProps["size"] = "normal"
): MarkdownEmojiTextProps["size"] => {
  // Для каждого уровня заголовка увеличиваем размер
  switch (level) {
    case 1:
      return SIZE_MAP[SIZE_MAP[baseSize] || baseSize] || "header";
    case 2:
      return SIZE_MAP[baseSize] || "large";
    default:
      return baseSize;
  }
};
