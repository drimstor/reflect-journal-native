import { MarkdownEmojiTextProps } from "../../model/types";
import { SIZE_MAP } from "../../const/static";

// Получает размер для заголовка на основе уровня и базового размера
export const getHeaderSize = (
  level: number,
  baseSize: MarkdownEmojiTextProps["size"] = "normal"
): MarkdownEmojiTextProps["size"] => {
  return level === 1 ? SIZE_MAP[baseSize] || "large" : baseSize;
};
