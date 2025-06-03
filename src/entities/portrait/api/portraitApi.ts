import { baseApi } from "@/src/shared/api/baseApi";
import {
  PORTRAIT_TAG,
  PortraitStatsRequest,
  PortraitStatsResponse,
  PortraitGraphRequest,
  PortraitGraphResponse,
} from "../model/types";

export const portraitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение статистики портрета пользователя
    getPortraitStats: builder.query<
      PortraitStatsResponse,
      PortraitStatsRequest
    >({
      query: (params) => ({
        url: "/portrait/stats",
        params,
      }),
      providesTags: [{ type: PORTRAIT_TAG, id: "STATS" }],
    }),

    // Получение графа портрета пользователя
    getPortraitGraph: builder.query<
      PortraitGraphResponse,
      PortraitGraphRequest
    >({
      query: (params) => ({
        url: "/portrait/graph",
        params,
      }),
      providesTags: [{ type: PORTRAIT_TAG, id: "GRAPH" }],
    }),
  }),
});

// Экспортируем хуки
export const { useGetPortraitStatsQuery, useGetPortraitGraphQuery } =
  portraitApi;
