import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "@/src/shared/model/types";

const ClipboardTextIcon: FC<IconProps> = ({ color = "#000", size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 12.2H15M8 16.2H12.38M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6ZM16 4.02C19.33 4.2 21 5.43 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44 4.67 4.2 8 4.02"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ClipboardTextIcon;
