import { IconProps } from "@/src/shared/model/types";
import { FC } from "react";

export interface BottomSheetAction {
  text: string;
  IconComponent: FC<IconProps>;
  onPress?: () => void;
  iconColor?: string;
}

export interface BottomSheetActionsProps {
  items: BottomSheetAction[];
}
