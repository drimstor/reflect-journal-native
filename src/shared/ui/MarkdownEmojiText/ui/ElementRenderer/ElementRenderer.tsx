import Text from "../../../Text/Text";
import { ParsedElement, MarkdownEmojiTextProps } from "../../model/types";
import { getHeaderSize } from "../../lib/helpers/sizeUtils";

interface ElementRendererProps {
  element: ParsedElement;
  index: number;
  size?: MarkdownEmojiTextProps["size"];
  font?: MarkdownEmojiTextProps["font"];
  color?: string;
  withOpacity?: number | string;
}

// Компонент для рендера отдельного элемента
const ElementRenderer = ({
  element,
  index,
  size,
  font,
  color,
  withOpacity,
}: ElementRendererProps) => {
  switch (element.type) {
    case "bold":
      return (
        <Text
          key={index}
          size={size}
          font="bold"
          color={color}
          withOpacity={withOpacity}
        >
          {element.content}
        </Text>
      );

    case "header":
      return (
        <Text
          key={index}
          size={getHeaderSize(element.level || 1, size)}
          font="bold"
          color={color}
          withOpacity={withOpacity}
        >
          {element.content}
        </Text>
      );

    case "emoji":
      return (
        <Text
          key={index}
          size={size}
          color={color}
          withOpacity={withOpacity}
          style={{ fontFamily: "System" }}
        >
          {element.content}
        </Text>
      );

    default:
      return (
        <Text
          key={index}
          size={size}
          font={font}
          color={color}
          withOpacity={withOpacity}
        >
          {element.content}
        </Text>
      );
  }
};

export default ElementRenderer;
