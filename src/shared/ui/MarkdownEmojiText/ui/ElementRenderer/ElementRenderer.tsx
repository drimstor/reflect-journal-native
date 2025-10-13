import React, { Fragment } from "react";
import Text from "../../../Text/Text";
import { replaceElementsMarkers } from "../../lib/helpers/replaceElementsMarkers";
import { getHeaderSize } from "../../lib/helpers/sizeUtils";
import {
  ElementPlaceholder,
  MarkdownEmojiTextProps,
  ParsedElement,
} from "../../model/types";

interface ElementRendererProps {
  element: ParsedElement;
  index: number;
  size?: MarkdownEmojiTextProps["size"];
  font?: MarkdownEmojiTextProps["font"];
  color?: string;
  withOpacity?: number | string;
  isEmoji?: boolean;
  placeholderMap?: Record<string, ElementPlaceholder>; // Карта маркеров для замены
}

// Компонент для рендера отдельного элемента
const ElementRenderer = ({
  element,
  index,
  size,
  font,
  color,
  withOpacity,
  isEmoji,
  placeholderMap,
}: ElementRendererProps) => {
  const content = replaceElementsMarkers(element.content, placeholderMap);

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
          {content.map((item, idx) => (
            <Fragment key={`bold-${index}-${idx}`}>{item}</Fragment>
          ))}
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
          {content.map((item, idx) => (
            <Fragment key={`header-${index}-${idx}`}>{item}</Fragment>
          ))}
        </Text>
      );

    case "emoji":
      if (!isEmoji) return null;

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
          {content.map((item, idx) => (
            <Fragment key={`text-${index}-${idx}`}>{item}</Fragment>
          ))}
        </Text>
      );
  }
};

export default ElementRenderer;
