import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../../model/types";
import { PALLETE_COLORS } from "../../const";

export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = PALLETE_COLORS.dark.contrast,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 12.6111L8.92308 17.5L20 6.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
