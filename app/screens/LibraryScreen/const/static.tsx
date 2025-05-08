import React from "react";
import {
  BookIcon,
  MailIcon,
  ClipboardCheckIcon,
  DirectIcon,
} from "@/src/shared/ui/icons";

export const LIBRARY_ITEMS = [
  {
    id: "Journals",
    colorKey: "blue",
    getIcon: (color: string, size: number) => (
      <BookIcon color={color} size={size} />
    ),
  },
  {
    id: "Chats",
    colorKey: "purple",
    getIcon: (color: string, size: number) => (
      <MailIcon color={color} size={size} />
    ),
  },
  {
    id: "Goals",
    colorKey: "green",
    getIcon: (color: string, size: number) => (
      <ClipboardCheckIcon color={color} size={size} />
    ),
  },
  {
    id: "Summaries",
    colorKey: "orange",
    getIcon: (color: string, size: number) => (
      <DirectIcon color={color} size={size} />
    ),
  },
];
