import { AnimatedIconProps } from "@/src/shared/ui/iconsAnimated/types";
import { ReactNode } from "react";

export interface ListItemPreviewProps {
  title: string;
  subTitle: string;
  IconComponent: (props: AnimatedIconProps) => ReactNode;
  backgroundColor?: string;
  backgroundColorForAnimate?: string;
  onPress?: () => void;
  onDotsPress?: () => void;
}

export interface useColorsAnimateProps {
  backgroundColor: string;
  backgroundColorForAnimate: string;
  color: string;
  colorForAnimate: string;
}
