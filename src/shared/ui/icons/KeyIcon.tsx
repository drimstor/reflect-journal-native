import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const KeyIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.25 12C13.9404 12 14.5 11.4404 14.5 10.75C14.5 10.0596 13.9404 9.5 13.25 9.5C12.5596 9.5 12 10.0596 12 10.75C12 11.4404 12.5596 12 13.25 12Z"
        fill={color}
      />
      <Path
        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM15.89 13.47C14.86 14.49 13.39 14.81 12.09 14.4L11.03 15.45C10.94 15.54 10.78 15.54 10.68 15.45L9.71 14.48C9.57 14.34 9.33 14.34 9.18 14.48C9.03 14.62 9.04 14.86 9.18 15.01L10.15 15.98C10.25 16.08 10.25 16.24 10.15 16.33L9.74 16.74C9.57 16.92 9.24 17.03 9 17L7.91 16.85C7.55 16.8 7.22 16.46 7.16 16.1L7.01 15.01C6.97 14.77 7.09 14.44 7.25 14.27L9.6 11.92C9.2 10.62 9.51 9.15 10.54 8.12C12.01 6.65 14.41 6.65 15.89 8.12C17.37 9.59 17.37 11.99 15.89 13.47Z"
        fill={color}
      />
    </Svg>
  );
};

export default KeyIcon;
