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
  const {
    appearance: { isEmoji },
  } = useSettingsStore();

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
          isEmoji={isEmoji}
        />
      ))}
    </Text>
  );
};

export default MarkdownEmojiText;
