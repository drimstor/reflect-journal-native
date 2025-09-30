import {
  BookIcon,
  ClipboardCheckIcon,
  ClipboardTextIcon,
  DirectIcon,
  MailIcon,
} from "@/src/shared/ui/icons";
import React from "react";
import { ENTITY_NAME } from "../../../../src/shared/const/ENTITIES";

export const LIBRARY_ITEMS = [
  {
    id: ENTITY_NAME.JOURNALS,
    colorKey: "accent",
    getIcon: (color: string, size: number) => (
      <BookIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.CHATS,
    colorKey: "color2",
    getIcon: (color: string, size: number) => (
      <MailIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.GOALS,
    colorKey: "color4",
    getIcon: (color: string, size: number) => (
      <ClipboardCheckIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.SUMMARIES,
    colorKey: "color3",
    getIcon: (color: string, size: number) => (
      <DirectIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.TESTS,
    colorKey: "color1",
    getIcon: (color: string, size: number) => (
      <ClipboardTextIcon color={color} size={size} />
    ),
  },
];
