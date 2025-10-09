import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import React from "react";
import { View } from "react-native";

interface TextWithIconProps {
  text: string;
  element: React.ReactElement;
  placeholder?: string;
  separator?: string;
  textColor?: string;
  textSize?: "small" | "normal" | "medium" | "large";
}

export const TextWithIcon: React.FC<TextWithIconProps> = ({
  text,
  element,
  placeholder = "[ICON_COMPONENT]",
  separator = "\n",
  textColor,
  textSize = "normal",
}) => {
  const { colors } = useThemeStore();
  const finalTextColor = textColor || colors.contrast;

  // Разбиваем текст по разделителю (по умолчанию по строкам)
  const lines = text.split(separator);

  return (
    <View>
      {lines.map((line, lineIndex) => {
        const parts = line.split(placeholder);

        return (
          <View
            key={lineIndex}
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {parts.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                <Text color={finalTextColor} size={textSize}>
                  {part}
                </Text>
                {partIndex < parts.length - 1 && element}
              </React.Fragment>
            ))}
          </View>
        );
      })}
    </View>
  );
};
