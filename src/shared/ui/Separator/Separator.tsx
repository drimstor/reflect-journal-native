import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import React from "react";
import { View } from "react-native";
import { useT } from "../../lib/hooks";
import { styles } from "./Separator.styles";

export interface SeparatorProps {
  text?: string; // Текст разделителя
  lineWidth?: string; // Ширина линий (по умолчанию 40%)
  marginVertical?: number; // Вертикальный отступ
}

/**
 * Компонент разделителя с текстом посередине
 * Используется для разделения секций с подписью
 *
 * @example
 * <Separator text="или" />
 * <Separator text="и" lineWidth="35%" />
 */
export const Separator: React.FC<SeparatorProps> = ({
  text,
  lineWidth = "40%",
  marginVertical = 0,
}) => {
  const { colors } = useThemeStore();
  const t = useT();

  return (
    <View style={[styles.separator, { marginVertical }]}>
      <View
        style={[
          styles.line,
          { width: lineWidth as any, backgroundColor: colors.contrast },
        ]}
      />
      <Text color={colors.contrast} style={styles.text}>
        {text || t("auth.or")}
      </Text>
      <View
        style={[
          styles.line,
          { width: lineWidth as any, backgroundColor: colors.contrast },
        ]}
      />
    </View>
  );
};

export default Separator;
