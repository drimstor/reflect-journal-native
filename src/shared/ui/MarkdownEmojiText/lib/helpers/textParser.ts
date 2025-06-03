import { ParsedElement } from "../../model/types";
import { EMOJI_REGEX, BOLD_REGEX, HEADER_REGEX } from "../../const/static";

// Добавляет текстовый элемент в массив, если контент не пустой
export const addTextElement = (content: string, elements: ParsedElement[]) => {
  if (content) {
    elements.push({ type: "text", content });
  }
};

// Парсит эмодзи в тексте и добавляет элементы в массив
export const parseEmojis = (text: string, elements: ParsedElement[]) => {
  const emojis = text.match(EMOJI_REGEX);
  if (!emojis) {
    addTextElement(text, elements);
    return;
  }

  const strings = text.split(EMOJI_REGEX);
  strings.forEach((str, index) => {
    addTextElement(str, elements);
    if (index < emojis.length) {
      elements.push({ type: "emoji", content: emojis[index] });
    }
  });
};

// Парсит одну строку текста на элементы
export const parseLine = (line: string, elements: ParsedElement[]) => {
  // Проверяем заголовок
  const headerMatch = line.match(HEADER_REGEX);
  if (headerMatch) {
    elements.push({
      type: "header",
      content: headerMatch[2],
      level: headerMatch[1].length,
    });
    return;
  }

  // Разбираем жирный текст
  let lastIndex = 0;
  const boldMatches = Array.from(line.matchAll(BOLD_REGEX));

  boldMatches.forEach((match) => {
    const beforeBold = line.slice(lastIndex, match.index);
    parseEmojis(beforeBold, elements);
    elements.push({ type: "bold", content: match[1] });
    lastIndex = (match.index || 0) + match[0].length;
  });

  // Добавляем оставшийся текст
  parseEmojis(line.slice(lastIndex), elements);
};

// Основная функция парсинга текста
export const parseText = (text: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    if (index > 0) {
      elements.push({ type: "text", content: "\n" });
    }
    parseLine(line, elements);
  });

  return elements;
};
