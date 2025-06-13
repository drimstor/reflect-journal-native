import { baseApi } from "@/src/shared/api/baseApi";
import { EntityType } from "@/src/shared/model/types";
import {
  ENTITY_WITH_PARENT,
  ENTITY_WITH_PARENT_CONFIG,
} from "@/src/shared/const/ENTITIES";
import { getEntitiesIds } from "../../common/lib/helpers/getEntitiesIds";

interface RelateEntitiesRequest {
  source_type: EntityType;
  source_id: string;
  target_type: EntityType;
  target_id: string;
}

interface RelateEntitiesResponse {
  message: string;
}

export const entitiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    relateEntities: build.mutation<
      RelateEntitiesResponse,
      RelateEntitiesRequest
    >({
      query: (body) => ({
        url: "/entities/relate",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, body) => [
        {
          type: ENTITY_WITH_PARENT.includes(body.source_type)
            ? ENTITY_WITH_PARENT_CONFIG[body.source_type]
            : body.source_type,
          id: ENTITY_WITH_PARENT.includes(body.source_type)
            ? getEntitiesIds(body.source_id)[0]
            : body.source_id,
        },
        {
          type: ENTITY_WITH_PARENT.includes(body.target_type)
            ? ENTITY_WITH_PARENT_CONFIG[body.target_type]
            : body.target_type,
          id: ENTITY_WITH_PARENT.includes(body.target_type)
            ? getEntitiesIds(body.target_id)[0]
            : body.target_id,
        },
      ],
    }),
    unrelateEntities: build.mutation<
      RelateEntitiesResponse,
      RelateEntitiesRequest
    >({
      query: (body) => ({
        url: "/entities/relate",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, body) => [
        {
          type: ENTITY_WITH_PARENT.includes(body.source_type)
            ? ENTITY_WITH_PARENT_CONFIG[body.source_type]
            : body.source_type,
          id: ENTITY_WITH_PARENT.includes(body.source_type)
            ? getEntitiesIds(body.source_id)[0]
            : body.source_id,
        },
        {
          type: ENTITY_WITH_PARENT.includes(body.target_type)
            ? ENTITY_WITH_PARENT_CONFIG[body.target_type]
            : body.target_type,
          id: ENTITY_WITH_PARENT.includes(body.target_type)
            ? getEntitiesIds(body.target_id)[0]
            : body.target_id,
        },
      ],
    }),
  }),
});

export const { useRelateEntitiesMutation, useUnrelateEntitiesMutation } =
  entitiesApi;
