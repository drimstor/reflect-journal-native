import {
  baseQueryWithReauth,
  formatValidationErrors,
} from "@/src/shared/store";
import type {
  Goal,
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
  AddChecklistItemRequest,
  UpdateChecklistItemRequest,
} from "../model/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";

export const GOALS_TAG = "Goals" as const;
type TagTypes = typeof GOALS_TAG;

export const goalsApi = createApi({
  reducerPath: "goalsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [GOALS_TAG],
  endpoints: (builder) => ({
    getGoals: builder.query<GoalResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/goals${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: GOALS_TAG, id })),
              { type: GOALS_TAG, id: "LIST" },
            ]
          : [{ type: GOALS_TAG, id: "LIST" }],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const params = new URLSearchParams(queryArgs.params || "");
        const hasOnlyPagination = Array.from(params.keys()).every(
          (key) => key === "page" || key === "limit"
        );

        return hasOnlyPagination
          ? endpointName
          : `${endpointName}-${queryArgs.params}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        const params = new URLSearchParams(arg.params || "");
        const hasOnlyPagination = Array.from(params.keys()).every(
          (key) => key === "page" || key === "limit"
        );

        if (!hasOnlyPagination) {
          return newItems;
        }

        if (currentCache) {
          const existingIds = new Set(currentCache.data.map((item) => item.id));
          const uniqueNewItems = newItems.data.filter(
            (item) => !existingIds.has(item.id)
          );

          return {
            ...newItems,
            data: [...currentCache.data, ...uniqueNewItems],
          };
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getGoal: builder.query<Goal, string>({
      query: (id) => ({
        url: `/goals/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: GOALS_TAG, id }],
    }),

    createGoal: builder.mutation<Goal, CreateGoalRequest>({
      query: (body) => ({
        url: "/goals",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: GOALS_TAG, id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data) ||
              "Не удалось создать цель"
          );
        }
      },
    }),

    updateGoal: builder.mutation<Goal, { id: string; body: UpdateGoalRequest }>(
      {
        query: ({ id, body }) => ({
          url: `/goals/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: GOALS_TAG, id },
          { type: GOALS_TAG, id: "LIST" },
        ],
      }
    ),

    addChecklistItem: builder.mutation<
      Goal,
      { goalId: string; body: AddChecklistItemRequest }
    >({
      query: ({ goalId, body }) => ({
        url: `/goals/${goalId}/checklist`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: GOALS_TAG, id: goalId },
      ],
    }),

    updateChecklistItem: builder.mutation<
      Goal,
      { goalId: string; itemId: string; body: UpdateChecklistItemRequest }
    >({
      query: ({ goalId, itemId, body }) => ({
        url: `/goals/${goalId}/checklist/${itemId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: GOALS_TAG, id: goalId },
      ],
    }),

    deleteGoal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: GOALS_TAG, id },
        { type: GOALS_TAG, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetGoalsQuery,
  useGetGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useAddChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteGoalMutation,
} = goalsApi;
