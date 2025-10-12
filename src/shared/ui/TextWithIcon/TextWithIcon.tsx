import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import React from "react";
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

  // Функция для замены всех placeholder'ов в тексте
  const renderTextWithElements = (
    inputText: string
  ): (string | React.ReactElement)[] => {
    let result: (string | React.ReactElement)[] = [inputText];

    elements.forEach((config, configIndex) => {
      const newResult: (string | React.ReactElement)[] = [];

      result.forEach((item) => {
        if (typeof item === "string") {
          const parts = item.split(config.placeholder);
          parts.forEach((part, partIndex) => {
            if (part) newResult.push(part);
            if (partIndex < parts.length - 1) {
              newResult.push(
                <View
                  key={`${configIndex}-${partIndex}`}
                  style={{ height: config.elementSize || 17.5 }}
                >
                  {config.element}
                </View>
              );
            }
          });
        } else {
          newResult.push(item);
        }
      });

      result = newResult;
    });

    return result;
  };

  const renderedContent = renderTextWithElements(text);

  return (
    <Text color={finalTextColor} size={textSize} style={style}>
      {renderedContent.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </Text>
  );
};
