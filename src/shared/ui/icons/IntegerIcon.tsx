import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const IntegerIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13.98 4.46997L12 2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.0899 7.79999C20.1999 9.27999 20.8899 11.11 20.8899 13.11C20.8899 18.02 16.9099 22 11.9999 22C7.08988 22 3.10986 18.02 3.10986 13.11C3.10986 8.19999 7.08988 4.21997 11.9999 4.21997C12.6799 4.21997 13.3399 4.31002 13.9799 4.46002"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.54004 15.92V10.5801L8.04004 12.2501"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 10.5801C15.1 10.5801 16 11.4801 16 12.5801V13.9301C16 15.0301 15.1 15.9301 14 15.9301C12.9 15.9301 12 15.0301 12 13.9301V12.5801C12 11.4701 12.9 10.5801 14 10.5801Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IntegerIcon;
