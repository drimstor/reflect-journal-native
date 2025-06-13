export interface DocumentResponse {
  id: string;
  title: string;
  description: string;
  content: string;
  type: DocumentType;
  command: string;
  related_topics: string[];
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export enum DocumentType {
  ARTICLES = "articles",
}

export interface GetAllDocumentsRequest {
  // Пустой интерфейс для запроса всех документов
}

export interface GetDocumentByIdRequest {
  id: string;
}
