import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const ChartSolidIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM9.11 16.9C9.11 17.18 8.89 17.4 8.61 17.4H5.82C5.54 17.4 5.32 17.18 5.32 16.9V12.28C5.32 11.65 5.83 11.14 6.46 11.14H8.61C8.89 11.14 9.11 11.36 9.11 11.64V16.9ZM13.89 16.9C13.89 17.18 13.67 17.4 13.39 17.4H10.6C10.32 17.4 10.1 17.18 10.1 16.9V7.74C10.1 7.11 10.61 6.6 11.24 6.6H12.76C13.39 6.6 13.9 7.11 13.9 7.74V16.9H13.89ZM18.68 16.9C18.68 17.18 18.46 17.4 18.18 17.4H15.39C15.11 17.4 14.89 17.18 14.89 16.9V13.35C14.89 13.07 15.11 12.85 15.39 12.85H17.54C18.17 12.85 18.68 13.36 18.68 13.99V16.9Z"
        fill={color}
      />
    </Svg>
  );
};

export default ChartSolidIcon;
