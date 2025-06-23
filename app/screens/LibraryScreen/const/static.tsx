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
    colorKey: "blue",
    getIcon: (color: string, size: number) => (
      <BookIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.CHATS,
    colorKey: "purple",
    getIcon: (color: string, size: number) => (
      <MailIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.GOALS,
    colorKey: "green",
    getIcon: (color: string, size: number) => (
      <ClipboardCheckIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.SUMMARIES,
    colorKey: "orange",
    getIcon: (color: string, size: number) => (
      <DirectIcon color={color} size={size} />
    ),
  },
  {
    id: ENTITY_NAME.TESTS,
    colorKey: "error",
    getIcon: (color: string, size: number) => (
      <ClipboardTextIcon color={color} size={size} />
    ),
  },
];
