import { EntityType } from "../model/types";

export const ENTITY_SINGULAR = {
  CHAT: "Chat",
  GOAL: "Goal",
  JOURNAL: "Journal",
  SUMMARY: "Summary",
  JOURNAL_ENTRY: "JournalEntry",
  MESSAGE: "Message",
};

export const ENTITY_PLURAL: Record<string, EntityType> = {
  CHAT: "Chats",
  GOAL: "Goals",
  JOURNAL: "Journals",
  SUMMARY: "Summaries",
  JOURNAL_ENTRY: "JournalEntries",
  MESSAGE: "Messages",
};

export const ENTITY_WITH_PARENT = [
  ENTITY_PLURAL.JOURNAL_ENTRY,
  ENTITY_PLURAL.MESSAGE,
];

export const ENTITY_WITH_PARENT_CONFIG = {
  [ENTITY_PLURAL.JOURNAL_ENTRY]: ENTITY_PLURAL.JOURNAL,
  [ENTITY_PLURAL.MESSAGE]: ENTITY_PLURAL.CHAT,
};
