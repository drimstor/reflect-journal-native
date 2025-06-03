import Text from "../Text/Text";
import { MarkdownEmojiTextProps } from "./model/types";
import { useMarkdownParser } from "./lib/hooks/useMarkdownParser";
import ElementRenderer from "./ui/ElementRenderer/ElementRenderer";

/**
 * Компонент для отображения текста с поддержкой эмодзи и базового Markdown
 * Поддерживает: эмодзи, жирный текст (**text**), заголовки (# text)
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
}: MarkdownEmojiTextProps) => {
  // Если не строка, возвращаем обычный Text
  if (typeof children !== "string") {
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

  const { shouldParse, parsedElements } = useMarkdownParser(children);

  // Если парсинг не нужен, возвращаем обычный Text
  if (!shouldParse || !parsedElements) {
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
        />
      ))}
    </Text>
  );
};

export default MarkdownEmojiText;
