import { EntityType } from "../model/types";

export const ENTITY_NAME: Record<string, EntityType> = {
  CHATS: "Chats",
  GOALS: "Goals",
  JOURNALS: "Journals",
  SUMMARIES: "Summaries",
  JOURNAL_ENTRIES: "JournalEntries",
  MESSAGES: "Messages",
  DOCUMENTS: "Documents",
  TESTS: "Tests",
  TEST_RESULTS: "TestResults",
};

export const ENTITY_WITH_PARENT = [
  ENTITY_NAME.JOURNALS_ENTRIES,
  ENTITY_NAME.MESSAGES,
  ENTITY_NAME.TEST_RESULTSS,
];

export const ENTITY_WITH_PARENT_CONFIG = {
  [ENTITY_NAME.JOURNAL_ENTRIES]: ENTITY_NAME.JOURNALS,
  [ENTITY_NAME.MESSAGES]: ENTITY_NAME.CHATS,
  [ENTITY_NAME.TEST_RESULTS]: ENTITY_NAME.TESTS,
};

export const ENTITY_WITH_CHILDREN_CONFIG = {
  [ENTITY_NAME.JOURNALS]: ENTITY_NAME.JOURNAL_ENTRIES,
  [ENTITY_NAME.CHATS]: ENTITY_NAME.MESSAGES,
  [ENTITY_NAME.TESTS]: ENTITY_NAME.TEST_RESULTS,
};
