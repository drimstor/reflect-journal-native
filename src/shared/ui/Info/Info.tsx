import { useScreenInfoStore, useThemeStore } from "@/src/shared/store";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { FC, memo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Text, { TextProps } from "../Text/Text";
import Tooltip from "../Tooltip/Tooltip";
import { InfoIcon } from "../icons";
import { createStyles } from "./Info.styles";

interface InfoProps {
  children?: React.ReactNode | string; // Основной текст
  tooltipText: string; // Текст для тултипа
  iconSize?: number; // Размер иконки info
  gap?: number; // Расстояние между текстом и иконкой
  onPress?: () => void; // Колбэк при нажатии
  textProps?: Omit<TextProps, "children">;
  iconColor?: string;
}

type TooltipPosition = { top: number; left: number } | null;

const Info: FC<InfoProps> = ({
  children,
  tooltipText,
  iconSize = 16,
  gap = 4,
  onPress,
  textProps,
  iconColor,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const pressableRef = useRef<View>(null);
  const { screenInfo } = useScreenInfoStore();
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(null);

  const handlePress = () => {
    if (!tooltipPosition && pressableRef.current) {
      pressableRef.current.measure((x, y, width, height, pageX, pageY) => {
        const rightEdge = pageX + 250;

        let top = height + pageY + 10;
        let left = pageX - 10;

        if (rightEdge > WINDOW_WIDTH) left = pageX - 50;
        if (screenInfo.name === "CreateEntity") top += 70;

        setTooltipPosition({ top, left });
      });
    } else {
      setTooltipPosition(null);
    }
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress}>
      <View ref={pressableRef} style={[styles.pressableArea, { gap }]}>
        <Text color={colors.contrast} {...textProps}>
          {children && children}
        </Text>
        <InfoIcon size={iconSize} color={iconColor || colors.contrast} />
      </View>

      {tooltipPosition && (
        <Tooltip
          text={tooltipText}
          visible={!!tooltipPosition}
          onPress={handlePress}
          position={tooltipPosition}
        />
      )}
    </Pressable>
  );
};

export default memo(Info);
