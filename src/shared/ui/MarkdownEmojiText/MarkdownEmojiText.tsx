import { useSettingsStore } from "../../store/zustand/settings.store";
import Text from "../Text/Text";
import { useMarkdownParser } from "./lib/hooks/useMarkdownParser";
import { MarkdownEmojiTextProps } from "./model/types";
import ElementRenderer from "./ui/ElementRenderer/ElementRenderer";

/**
 * Компонент для отображения текста с поддержкой эмодзи и базового Markdown
 * Поддерживает:
 * - эмодзи
 * - жирный текст (**text**)
 * - заголовки разных уровней (# text, ## text, ### text, и т.д.)
 * - ненумерованные списки (- text)
 * - вставку элементов через placeholder'ы (опционально)
 */
const MarkdownEmojiText = ({
  children,
  size = "normal",
  font = "regular",
  color,
  withOpacity,
  style,
  numberOfLines,
  ellipsizeMode,
  elements,
}: MarkdownEmojiTextProps) => {
  const {
    appearance: { isEmoji },
  } = useSettingsStore();

  // Хуки должны вызываться всегда, до условных возвратов
  const isString = typeof children === "string";

  // Парсим текст с учетом placeholder'ов
  const { shouldParse, parsedElements, placeholderMap } = useMarkdownParser(
    isString ? (children as string) : "",
    { elements }
  );

  // Если не строка или парсинг не нужен, возвращаем обычный Text
  if (!isString || !shouldParse || !parsedElements) {
    return (
      <Text
        size={size}
        font={font}
        color={color}
        withOpacity={withOpacity}
        style={style}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {children}
      </Text>
    );
  }

  return (
    <Text
      size={size}
      font={font}
      color={color}
      withOpacity={withOpacity}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {parsedElements.map((element, index) => (
        <ElementRenderer
          key={index}
          element={element}
          index={index}
          size={size}
          font={font}
          color={color}
          withOpacity={withOpacity}
          isEmoji={isEmoji}
          placeholderMap={placeholderMap}
        />
      ))}
    </Text>
  );
};

export default MarkdownEmojiText;
