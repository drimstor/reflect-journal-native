import { useMemo } from "react";
import { EMOJI_REGEX } from "../../const/static";
import { parseText } from "../helpers/textParser";

// Хук для парсинга markdown текста
export const useMarkdownParser = (text: string) => {
  // Проверяет, нужно ли парсить текст
  const shouldParse = useMemo(() => {
    return (
      text.includes("**") ||
      text.includes("#") ||
      text.includes("- ") ||
      EMOJI_REGEX.test(text)
    );
  }, [text]);

  // Парсит текст на элементы
  const parsedElements = useMemo(() => {
    if (!shouldParse) return null;
    return parseText(text);
  }, [text, shouldParse]);

  return {
    shouldParse,
    parsedElements,
  };
};
