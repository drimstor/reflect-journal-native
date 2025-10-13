import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import { useMarkdownParser } from "@/src/shared/ui/MarkdownEmojiText/lib/hooks/useMarkdownParser";
import { ParsedElement } from "@/src/shared/ui/MarkdownEmojiText/model/types";
import React, { useMemo } from "react";
import { StyleProp, TextStyle, View } from "react-native";

interface ElementConfig {
  element: React.ReactElement;
  placeholder: string;
  elementSize?: number;
}

interface TextWithIconProps {
  text: string;
  elements: ElementConfig[];
  textColor?: string;
  textSize?: "small" | "normal" | "medium" | "large";
  style?: StyleProp<TextStyle>;
}

export const TextWithIcon: React.FC<TextWithIconProps> = ({
  text,
  elements,
  textColor,
  textSize = "normal",
  style,
}) => {
  const { colors } = useThemeStore();
  const finalTextColor = textColor || colors.contrast;

  // Сначала заменяем placeholder'ы на специальные маркеры с индексами
  const { processedText, placeholderMap } = useMemo(() => {
    let processed = text;
    const map: Record<string, ElementConfig> = {};

    elements.forEach((config, index) => {
      const marker = `__ELEMENT_${index}__`;
      processed = processed.split(config.placeholder).join(marker);
      map[marker] = config;
    });

    return { processedText: processed, placeholderMap: map };
  }, [text, elements]);

  // Парсим обработанный текст
  const { shouldParse, parsedElements } = useMarkdownParser(processedText);

  // Применяем рендеринг
  const renderedContent = useMemo(() => {
    // Заменяет маркеры на React элементы
    const replaceMarkers = (
      inputText: string
    ): (string | React.ReactElement)[] => {
      const result: (string | React.ReactElement)[] = [];
      const markerRegex = /__ELEMENT_(\d+)__/g;
      let lastIndex = 0;
      let match;

      while ((match = markerRegex.exec(inputText)) !== null) {
        // Добавляем текст до маркера
        if (match.index > lastIndex) {
          result.push(inputText.slice(lastIndex, match.index));
        }

        // Добавляем элемент
        const marker = match[0];
        const config = placeholderMap[marker];
        if (config) {
          result.push(
            <View
              key={`element-${match[1]}-${match.index}`}
              style={{ height: config.elementSize || 17.5 }}
            >
              {config.element}
            </View>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      // Добавляем оставшийся текст
      if (lastIndex < inputText.length) {
        result.push(inputText.slice(lastIndex));
      }

      return result.length > 0 ? result : [inputText];
    };

    // Рендерит ParsedElement в React элемент
    const renderParsedElement = (
      element: ParsedElement,
      index: number
    ): React.ReactNode => {
      switch (element.type) {
        case "bold":
          // Проверяем, есть ли маркеры внутри жирного текста
          const boldContent = replaceMarkers(element.content);
          return (
            <Text
              key={`bold-${index}`}
              font="bold"
              color={finalTextColor}
              size={textSize}
            >
              {boldContent.map((item, idx) => (
                <React.Fragment key={`bold-${index}-${idx}`}>
                  {item}
                </React.Fragment>
              ))}
            </Text>
          );
        case "text":
          // Для текстовых элементов заменяем маркеры
          return replaceMarkers(element.content).map((item, idx) => (
            <React.Fragment key={`text-${index}-${idx}`}>{item}</React.Fragment>
          ));
        default:
          return element.content;
      }
    };

    // Если нет парсинга markdown, просто заменяем маркеры
    if (!shouldParse || !parsedElements) {
      return replaceMarkers(processedText);
    }

    // Если есть парсинг, обрабатываем каждый элемент
    const finalResult: React.ReactNode[] = [];

    parsedElements.forEach((element, index) => {
      finalResult.push(renderParsedElement(element, index));
    });

    return finalResult;
  }, [
    processedText,
    placeholderMap,
    shouldParse,
    parsedElements,
    finalTextColor,
    textSize,
  ]);

  return (
    <Text color={finalTextColor} size={textSize} style={style}>
      {renderedContent}
    </Text>
  );
};
