import { baseApi } from "@/src/shared/api/baseApi";
import { formatValidationErrors } from "@/src/shared/store";
import type {
  Summary,
  SummaryResponse,
  CreateSummaryRequest,
  UpdateSummaryRequest,
} from "../model/types";
import { Alert } from "react-native";
import { mergeQueryData } from "@/src/shared/store";

export const SUMMARY_TAG = "Summaries" as const;
type TagTypes = typeof SUMMARY_TAG;

export const summaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummaries: builder.query<SummaryResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/summary${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: SUMMARY_TAG, id })),
              { type: SUMMARY_TAG, id: "LIST" },
            ]
          : [{ type: SUMMARY_TAG, id: "LIST" }],
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

    getSummary: builder.query<Summary, { id: string }>({
      query: ({ id }) => ({
        url: `/summary/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: SUMMARY_TAG, id }],
    }),

    createSummary: builder.mutation<Summary, CreateSummaryRequest>({
      query: (body) => ({
        url: "/summary/by-type",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: SUMMARY_TAG, id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data) ||
              "Не удалось создать саммари"
          );
        }
      },
    }),

    updateSummary: builder.mutation<
      Summary,
      { id: string; body: UpdateSummaryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/summary/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: SUMMARY_TAG, id },
        { type: SUMMARY_TAG, id: "LIST" },
      ],
    }),

    refreshSummary: builder.mutation<Summary, string>({
      query: (id) => ({
        url: `/summary/refresh/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: SUMMARY_TAG, id },
        { type: SUMMARY_TAG, id: "LIST" },
      ],
    }),

    deleteSummary: builder.mutation<void, string>({
      query: (id) => ({
        url: `/summary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: SUMMARY_TAG, id },
        { type: SUMMARY_TAG, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSummariesQuery,
  useGetSummaryQuery,
  useCreateSummaryMutation,
  useUpdateSummaryMutation,
  useRefreshSummaryMutation,
  useDeleteSummaryMutation,
} = summaryApi;
