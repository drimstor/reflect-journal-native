import { baseApi } from "@/src/shared/api/baseApi";
import { formatValidationErrors } from "@/src/shared/store";
import type {
  Goal,
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
  AddChecklistItemRequest,
  UpdateChecklistItemRequest,
  BulkUpdateChecklistItemsRequest,
  PredictGoalRequest,
  GenerateGoalRequest,
  SaveGoalRequest,
} from "../model/types";
import { Alert } from "react-native";
import { mergeQueryData } from "@/src/shared/store";

export const GOALS_TAG = "Goals" as const;
type TagTypes = typeof GOALS_TAG;

export const goalsApi = baseApi.injectEndpoints({
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
        return mergeQueryData(currentCache, newItems, arg.params);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getGoal: builder.query<Goal, { id: string }>({
      query: ({ id }) => ({
        url: `/goals/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: GOALS_TAG, id }],
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

    bulkUpdateChecklistItems: builder.mutation<
      Goal,
      { goalId: string; body: BulkUpdateChecklistItemsRequest }
    >({
      query: ({ goalId, body }) => ({
        url: `/goals/${goalId}/checklist`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: GOALS_TAG, id: "LIST" },
      ],
    }),

    predictGoal: builder.mutation<Goal, PredictGoalRequest>({
      query: (body) => ({
        url: "/goals/predict",
        method: "POST",
        body,
      }),
    }),

    generateGoal: builder.mutation<Goal, GenerateGoalRequest>({
      query: (body) => ({
        url: "/goals/generate",
        method: "POST",
        body,
      }),
    }),

    saveGoal: builder.mutation<Goal, SaveGoalRequest>({
      query: (body) => ({
        url: "/goals/save",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: GOALS_TAG, id: "LIST" }],
    }),

    deleteGoal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: GOALS_TAG, id: "LIST" }],
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
  useBulkUpdateChecklistItemsMutation,
  usePredictGoalMutation,
  useGenerateGoalMutation,
  useSaveGoalMutation,
  useDeleteGoalMutation,
} = goalsApi;
