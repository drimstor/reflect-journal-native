import { useMemo } from "react";
import { EMOJI_REGEX } from "../../const/static";
import { ElementPlaceholder } from "../../model/types";
import { parseText } from "../helpers/textParser";

interface UseMarkdownParserOptions {
  elements?: ElementPlaceholder[];
}

// Хук для парсинга markdown текста с поддержкой placeholder'ов
export const useMarkdownParser = (
  text: string,
  options?: UseMarkdownParserOptions
) => {
  // Обрабатываем placeholder'ы и создаем карту маркеров
  const { processedText, placeholderMap } = useMemo(() => {
    if (!options?.elements || options.elements.length === 0) {
      return { processedText: text, placeholderMap: undefined };
    }

    let processed = text;
    const map: Record<string, ElementPlaceholder> = {};

    options.elements.forEach((config, index) => {
      const marker = `__ELEMENT_${index}__`;
      processed = processed.split(config.placeholder).join(marker);
      map[marker] = config;
    });

    return { processedText: processed, placeholderMap: map };
  }, [text, options?.elements]);

  // Проверяет, нужно ли парсить текст (markdown или placeholder'ы)
  const shouldParse = useMemo(() => {
    const hasMarkdown =
      processedText.includes("**") ||
      processedText.includes("#") ||
      processedText.includes("- ") ||
      EMOJI_REGEX.test(processedText);

    const hasPlaceholders = !!placeholderMap;

    return hasMarkdown || hasPlaceholders;
  }, [processedText, placeholderMap]);

  // Парсит текст на элементы
  const parsedElements = useMemo(() => {
    if (!shouldParse) return null;
    return parseText(processedText);
  }, [processedText, shouldParse]);

  return {
    shouldParse,
    parsedElements,
    placeholderMap,
  };
};
