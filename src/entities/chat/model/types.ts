import { PaginationResponse } from "@/src/shared/model/types";

export interface Entity {
  // TODO: определить структуру Entity когда будет известна
  id: string;
  [key: string]: any;
}

export interface Chat {
  user_id: string;
  name: string;
  description: string;
  id: string;
  created_at: string;
  updated_at: string;
  related_topics: string[];
  related_entities: Entity[];
  bookmarked: boolean;
}

export interface CreateChatRequest {
  name: string;
  description?: string;
  related_topics?: string[];
}

export interface UpdateChatRequest {
  name?: string;
  description?: string;
  related_topics?: string[];
  related_entities?: Entity[];
  bookmarked?: boolean;
}

export interface ChatResponse {
  data: Chat[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export type SortField = "name" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";

export interface Message {
  id: string;
  content: string;
  user_id: string;
  chat_id: string;
  created_at: string;
  updated_at: string;
  command?: string;
}

export interface MessageGiftedChat {
  _id: string;
  text: string;
  createdAt: string;
  user: { _id: string };
  command?: string;
}

export interface CreateMessageRequest {
  content: string;
  chat_id: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export type MessageResponse = PaginationResponse<Message>;

export type MessagesGiftedChat = PaginationResponse<MessageGiftedChat>;

export interface CreateAIMessageFromEntityRequest {
  source_type: string;
  source_id: string;
  chatId: string;
}
