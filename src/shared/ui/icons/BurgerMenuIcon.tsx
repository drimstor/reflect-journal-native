import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const BurgerMenuIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path stroke={color} d="M3 12H21" strokeWidth="1.5" strokeLinecap="round" />
    <Path stroke={color} d="M3 17H21" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export default BurgerMenuIcon;
