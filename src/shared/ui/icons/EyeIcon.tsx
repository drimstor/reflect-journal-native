import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
import { IconProps } from "../../model/types";
import { PALLETE_COLORS } from "../../const";

export const EyeIcon = ({
  size = 24,
  color = PALLETE_COLORS.dark.contrast,
  ...props
}: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 16.33C9.61 16.33 7.67 14.39 7.67 12C7.67 9.61 9.61 7.67 12 7.67C14.39 7.67 16.33 9.61 16.33 12C16.33 14.39 14.39 16.33 12 16.33Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 20.96C15.83 20.96 19.34 18.88 21.72 15.13C22.43 13.9 22.43 10.09 21.72 8.86001C19.34 5.11001 15.83 3.03003 12 3.03003C8.17 3.03003 4.66 5.11001 2.28 8.86001C1.57 10.09 1.57 13.9 2.28 15.13C4.66 18.88 8.17 20.96 12 20.96Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const EyeSlashIcon = ({
  size = 24,
  color = PALLETE_COLORS.dark.contrast,
  ...props
}: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M14.53 9.47L9.47 14.53C8.82 13.88 8.42 12.99 8.42 12C8.42 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.93"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.47 14.53L2 22"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L14.53 9.47"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
