import { PaginationResponse, SortField } from "@/src/shared/model/types";
import { SectionListRenderItem } from "react-native";

export interface WithDateAndId {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface VirtualizedListProps<ItemT extends WithDateAndId> {
  renderItem: SectionListRenderItem<ItemT, any>;
  data: PaginationResponse<ItemT> | undefined;
  isFetching: boolean;
  sortField?: Exclude<SortField, "name" | "count">;
}
