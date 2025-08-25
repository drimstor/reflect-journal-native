import { useScreenInfoStore, useThemeStore } from "@/src/shared/store";
import { FC, memo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Text, { TextProps } from "../Text/Text";
import Tooltip from "../Tooltip/Tooltip";
import { InfoIcon } from "../icons";
import { createStyles } from "./Info.styles";

interface InfoProps {
  children: React.ReactNode | string; // Основной текст
  tooltipText: string; // Текст для тултипа
  iconSize?: number; // Размер иконки info
  gap?: number; // Расстояние между текстом и иконкой
  onPress?: () => void; // Колбэк при нажатии
  textProps?: Omit<TextProps, "children">;
}

type TooltipPosition = { top: number; left: number } | null;

const Info: FC<InfoProps> = ({
  children,
  tooltipText,
  iconSize = 16,
  gap = 4,
  onPress,
  textProps,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const pressableRef = useRef<View>(null);
  const { screenInfo } = useScreenInfoStore();
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(null);

  const handlePress = () => {
    if (!tooltipPosition && pressableRef.current) {
      pressableRef.current.measure((x, y, width, height, pageX, pageY) => {
        let top = height + pageY + 13;
        const left = pageX - 10;
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
          {children}
        </Text>
        <InfoIcon size={iconSize} color={colors.contrast} />
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
