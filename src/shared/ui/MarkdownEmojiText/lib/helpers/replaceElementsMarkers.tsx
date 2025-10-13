import { ReactElement } from "react";
import { View } from "react-native";
import { ElementPlaceholder } from "../../model/types";

// Заменяет маркеры на React элементы
export const replaceElementsMarkers = (
  content: string,
  placeholderMap?: Record<string, ElementPlaceholder>
): (string | ReactElement)[] => {
  if (!placeholderMap || Object.keys(placeholderMap).length === 0) {
    return [content];
  }

  const result: (string | ReactElement)[] = [];
  const markerRegex = /__ELEMENT_(\d+)__/g;
  let lastIndex = 0;
  let match;

  while ((match = markerRegex.exec(content)) !== null) {
    // Добавляем текст до маркера
    if (match.index > lastIndex) {
      result.push(content.slice(lastIndex, match.index));
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
  if (lastIndex < content.length) {
    result.push(content.slice(lastIndex));
  }

  return result.length > 0 ? result : [content];
};
