import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const MaskSolidIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.6493 4.59125C16.8893 2.99125 14.5593 2.03125 11.9993 2.03125C6.4993 2.03125 2.0293 6.50125 2.0293 12.0013C2.0293 17.5013 6.4993 21.9712 11.9993 21.9712C14.5593 21.9712 16.8893 21.0112 18.6493 19.4112C20.6893 17.6012 21.9693 14.9412 21.9693 12.0013C21.9693 9.06125 20.6893 6.40125 18.6493 4.59125ZM11.9693 16.3912C11.9493 18.0413 10.7193 18.4412 9.5693 17.9812C7.1993 17.0312 5.5293 14.7113 5.5293 12.0013C5.5293 9.29125 7.1993 6.97125 9.5693 6.01125C10.7193 5.55125 11.9493 5.96125 11.9693 7.60125V16.3912Z"
        fill={color}
      />
    </Svg>
  );
};

export default MaskSolidIcon;
