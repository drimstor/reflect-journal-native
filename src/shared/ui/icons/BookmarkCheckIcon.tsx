import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

interface BookmarkCheckIconProps extends IconProps {
  fill?: boolean;
}

const BookmarkCheckIcon: FC<BookmarkCheckIconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
  fill = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16.8199 2H7.17995C5.04995 2 3.31995 3.74 3.31995 5.86V19.95C3.31995 21.75 4.60995 22.51 6.18995 21.64L11.0699 18.93C11.5899 18.64 12.4299 18.64 12.9399 18.93L17.8199 21.64C19.3999 22.52 20.6899 21.76 20.6899 19.95V5.86C20.6799 3.74 18.9499 2 16.8199 2Z"
      stroke={color}
      fill={fill ? color : undefined}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BookmarkCheckIcon;
