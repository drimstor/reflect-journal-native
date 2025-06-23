import { baseApi } from "@/src/shared/api/baseApi";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { formatValidationErrors, mergeQueryData } from "@/src/shared/store";
import { Alert } from "react-native";
import type {
  CreateTestResultRequest,
  TestResult,
  TestResultResponse,
  UpdateTestResultRequest,
} from "../model/types";

export const testResultsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestResults: builder.query<TestResultResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/test-results${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: ENTITY_NAME.TEST_RESULTS,
                id,
              })),
              { type: ENTITY_NAME.TEST_RESULTS, id: "LIST" },
            ]
          : [{ type: ENTITY_NAME.TEST_RESULTS, id: "LIST" }],
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

    getTestResult: builder.query<TestResult, { id: string }>({
      query: ({ id }) => ({
        url: `/test-results/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [
        { type: ENTITY_NAME.TEST_RESULTS, id },
      ],
    }),

    createTestResult: builder.mutation<TestResult, CreateTestResultRequest>({
      query: (body) => ({
        url: "/test-results/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: ENTITY_NAME.TEST_RESULTS, id: "LIST" },
        { type: ENTITY_NAME.TESTS, id: "LIST" }, // Обновляем счетчик результатов в тестах
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          Alert.alert(
            "Ошибка",
            formatValidationErrors(error.error?.data?.detail) ||
              "Не удалось сохранить результат теста"
          );
        }
      },
    }),

    updateTestResult: builder.mutation<
      TestResult,
      { id: string; body: UpdateTestResultRequest }
    >({
      query: ({ id, body }) => ({
        url: `/test-results/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: ENTITY_NAME.TEST_RESULTS, id },
        { type: ENTITY_NAME.TEST_RESULTS, id: "LIST" },
      ],
    }),

    deleteTestResult: builder.mutation<void, string>({
      query: (id) => ({
        url: `/test-results/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: ENTITY_NAME.TEST_RESULTS, id },
        { type: ENTITY_NAME.TEST_RESULTS, id: "LIST" },
        { type: ENTITY_NAME.TESTS, id: "LIST" }, // Обновляем счетчик результатов в тестах
      ],
    }),
  }),
});

export const testResultsApiUtil = testResultsApi.util;

export const {
  useGetTestResultsQuery,
  useGetTestResultQuery,
  useCreateTestResultMutation,
  useUpdateTestResultMutation,
  useDeleteTestResultMutation,
} = testResultsApi;
