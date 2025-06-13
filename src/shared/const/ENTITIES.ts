import { EntityType } from "../model/types";

export const ENTITY_NAME: Record<string, EntityType> = {
  CHAT: "Chats",
  GOAL: "Goals",
  JOURNAL: "Journals",
  SUMMARY: "Summaries",
  JOURNAL_ENTRY: "JournalEntries",
  MESSAGE: "Messages",
  DOCUMENT: "Documents",
};

export const ENTITY_WITH_PARENT = [
  ENTITY_NAME.JOURNAL_ENTRY,
  ENTITY_NAME.MESSAGE,
];

export const ENTITY_WITH_PARENT_CONFIG = {
  [ENTITY_NAME.JOURNAL_ENTRY]: ENTITY_NAME.JOURNAL,
  [ENTITY_NAME.MESSAGE]: ENTITY_NAME.CHAT,
};

export const ENTITY_WITH_CHILDREN_CONFIG = {
  [ENTITY_NAME.JOURNAL]: ENTITY_NAME.JOURNAL_ENTRY,
  [ENTITY_NAME.CHAT]: ENTITY_NAME.MESSAGE,
};
