import { ReactNode } from "react";
import { IconProps } from "@/src/shared/model/types";
import { FC } from "react";
import { PortraitNode } from "@/src/entities";

export interface ChartsScreenProps {}

export interface ChartItem extends PortraitNode {}

export interface ChartData {
  title: string;
  data: ChartItem[];
}

export type ChartsDataType = Record<string, ChartData>;

export interface ChartSelectionItem {
  name: string;
  type?: string;
}

export interface ActionItem {
  text: string;
  IconComponent?: FC<IconProps>;
  onPress: () => void;
  iconColor?: string;
  iconSize?: number;
}
