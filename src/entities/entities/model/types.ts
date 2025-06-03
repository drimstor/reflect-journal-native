import { EntityType } from "@/src/shared/model/types";

export interface RelatedEntity {
  id: string;
  type: EntityType;
  title: string;
  created_at: string;
  updated_at: string;
}
