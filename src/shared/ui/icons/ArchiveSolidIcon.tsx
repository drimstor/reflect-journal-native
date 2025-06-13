import React, { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../../model/types";
import { PALLETE_COLORS } from "@/src/shared/const";

const ArchiveSolidIcon: FC<IconProps> = ({
  size = 24,
  color = PALLETE_COLORS.dark.contrast,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z"
        fill={color}
      />
    </Svg>
  );
};

export default ArchiveSolidIcon;
