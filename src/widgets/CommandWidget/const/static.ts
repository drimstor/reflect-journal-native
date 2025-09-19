import { ENTITY_NAME } from "../../../shared/const/ENTITIES";

export const createChatConfig = {
  [ENTITY_NAME.JOURNAL_ENTRIES]: {
    nameKey: "chat.journalAutoName",
    descriptionKey: "chat.journalAutoDescription",
  },
  [ENTITY_NAME.SUMMARIES]: {
    nameKey: "chat.summaryAutoName",
    descriptionKey: "chat.summaryAutoDescription",
  },
  default: {
    nameKey: "chat.journalAutoName",
    descriptionKey: "chat.journalAutoDescription",
  },
};
