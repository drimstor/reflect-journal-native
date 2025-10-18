import { IconProps } from "@/src/shared/model/types";
import { ReactNode } from "react";

export interface ListItemPreviewProps {
  title: string;
  subTitle: string;
  IconComponent?: (props: IconProps) => ReactNode;
  customComponent?: ReactNode;
  backgroundColor?: string;
  backgroundColorForAnimate?: string;
  borderColor?: string;
  onPress?: () => void;
  element?: ReactNode;
}

export interface useColorsAnimateProps {
  backgroundColor: string;
  backgroundColorForAnimate: string;
  color: string;
  colorForAnimate: string;
}
