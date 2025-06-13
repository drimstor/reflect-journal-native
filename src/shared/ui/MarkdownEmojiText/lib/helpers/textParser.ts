import { ParsedElement } from "../../model/types";
import {
  EMOJI_REGEX,
  BOLD_REGEX,
  HEADER_REGEX,
  LIST_REGEX,
} from "../../const/static";

/**
 * Добавляет текстовый элемент в массив, если контент не пустой
 */
const addTextElement = (content: string, elements: ParsedElement[]): void => {
  if (content) {
    elements.push({ type: "text", content });
  }
};

/**
 * Добавляет элемент эмодзи в массив
 */
const addEmojiElement = (emoji: string, elements: ParsedElement[]): void => {
  elements.push({ type: "emoji", content: emoji });
};

/**
 * Добавляет элемент жирного текста в массив
 */
const addBoldElement = (content: string, elements: ParsedElement[]): void => {
  elements.push({ type: "bold", content });
};

/**
 * Парсит эмодзи в тексте и добавляет элементы в массив
 */
const parseEmojis = (text: string, elements: ParsedElement[]): void => {
  const emojis = text.match(EMOJI_REGEX);

  if (!emojis) {
    addTextElement(text, elements);
    return;
  }

  const textParts = text.split(EMOJI_REGEX);

  textParts.forEach((part, index) => {
    addTextElement(part, elements);

    // Добавляем эмодзи между частями текста
    if (index < emojis.length) {
      addEmojiElement(emojis[index], elements);
    }
  });
};

/**
 * Парсит содержимое с жирным текстом и эмодзи
 */
const parseContentWithFormatting = (
  content: string,
  elements: ParsedElement[]
): void => {
  let lastIndex = 0;
  const boldMatches = Array.from(content.matchAll(BOLD_REGEX));

  for (const match of boldMatches) {
    const matchIndex = match.index ?? 0;

    // Парсим текст до жирного выделения
    const beforeBold = content.slice(lastIndex, matchIndex);
    parseEmojis(beforeBold, elements);

    // Добавляем жирный текст
    addBoldElement(match[1], elements);

    lastIndex = matchIndex + match[0].length;
  }

  // Добавляем оставшийся текст после последнего жирного выделения
  const remainingText = content.slice(lastIndex);
  parseEmojis(remainingText, elements);
};

/**
 * Парсит заголовок и добавляет его в массив элементов
 */
const parseHeader = (line: string, elements: ParsedElement[]): boolean => {
  const headerMatch = line.match(HEADER_REGEX);

  if (!headerMatch) {
    return false;
  }

  elements.push({
    type: "header",
    content: headerMatch[2],
    level: headerMatch[1].length,
  });

  return true;
};

/**
 * Парсит элемент списка и добавляет его в массив элементов
 */
const parseListItem = (line: string, elements: ParsedElement[]): boolean => {
  const listMatch = line.match(LIST_REGEX);

  if (!listMatch) {
    return false;
  }

  // Добавляем маркер списка
  elements.push({ type: "text", content: " • " });

  // Парсим содержимое списка с учетом форматирования
  parseContentWithFormatting(listMatch[1], elements);

  return true;
};

/**
 * Парсит одну строку текста на элементы
 */
const parseLine = (line: string, elements: ParsedElement[]): void => {
  // Проверяем заголовок
  if (parseHeader(line, elements)) {
    return;
  }

  // Проверяем список
  if (parseListItem(line, elements)) {
    return;
  }

  // Обрабатываем обычную строку с жирным текстом и эмодзи
  parseContentWithFormatting(line, elements);
};

/**
 * Добавляет перенос строки между элементами
 */
const addLineBreak = (elements: ParsedElement[]): void => {
  elements.push({ type: "text", content: "\n" });
};

/**
 * Основная функция парсинга текста
 * Преобразует markdown-подобный текст в массив элементов для рендеринга
 */
export const parseText = (text: string): ParsedElement[] => {
  if (!text) {
    return [];
  }

  const elements: ParsedElement[] = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    // Добавляем перенос строки между строками (кроме первой)
    if (index > 0) {
      addLineBreak(elements);
    }

    parseLine(line, elements);
  });

  return elements;
};
