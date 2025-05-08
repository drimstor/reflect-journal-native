// Типы для портрета пользователя

// Тип данных для статистики типов узлов
export interface PortraitNodeType {
  type: string;
  count: number;
}

// Тип данных для узла портрета
export interface PortraitNode {
  name: string;
  type: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  count: number;
}

// Тип для запроса статистики портрета
export interface PortraitStatsRequest {
  min_count?: number;
  limit?: number;
  search?: string;
  related_topics?: string;
  category?: string;
  updated_at_from?: string;
  updated_at_to?: string;
  sort_field?: "count" | "name" | "updated_at";
  sort_order?: "asc" | "desc";
}

// Тип для ответа статистики портрета
export interface PortraitStatsResponse {
  top_types: PortraitNodeType[];
  top_nodes: PortraitNode[];
  top_by_type: Record<string, PortraitNode[]>;
}

// Тип для запроса графа портрета
export interface PortraitGraphRequest {
  limit?: number;
}

// Типы для ответа графа портрета
export interface PortraitGraphNode {
  id: number;
  label: string;
  type: string;
}

export interface PortraitGraphEdge {
  from: number;
  to: number;
  label: string;
}

export interface PortraitGraphResponse {
  nodes: PortraitGraphNode[];
  edges: PortraitGraphEdge[];
}

// Интерфейс для представления данных диаграммы
export interface ChartDataset {
  title: string;
  data: PortraitNode[];
}

// Константа для тега RTK Query
export const PORTRAIT_TAG = "Portrait";
