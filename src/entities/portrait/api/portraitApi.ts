import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/shared/store";
import {
  PORTRAIT_TAG,
  PortraitStatsRequest,
  PortraitStatsResponse,
  PortraitGraphRequest,
  PortraitGraphResponse,
} from "../model/types";

export const portraitApi = createApi({
  reducerPath: "portraitApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [PORTRAIT_TAG],
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
