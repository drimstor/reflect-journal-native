import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { PALLETE_COLORS } from "@/src/shared/const";
import { IconProps } from "@/src/shared/model/types";

const CloudSolidIcon: FC<IconProps> = ({
  color = PALLETE_COLORS.dark.contrast,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.74 12.9089C21.48 12.0489 21.05 11.2989 20.48 10.6889C19.75 9.85888 18.78 9.28888 17.69 9.03888C17.14 6.53888 15.6 4.73888 13.41 4.06888C11.03 3.32888 8.27 4.04888 6.54 5.85888C5.02 7.44888 4.52 9.63888 5.11 11.9689C3.11 12.4589 2.12 14.1289 2.01 15.7189C2 15.8289 2 15.9289 2 16.0289C2 17.9089 3.23 20.0189 5.97 20.2189H16.35C17.77 20.2189 19.13 19.6889 20.17 18.7389C21.8 17.3089 22.4 15.0789 21.74 12.9089Z"
        fill={color}
      />
    </Svg>
  );
};

export default CloudSolidIcon;
