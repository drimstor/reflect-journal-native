import { baseApi } from "@/src/shared/api/baseApi";
import type {
  CreateTestResultRequest,
  TestResult,
  TestResultsResponse,
  UpdateTestResultRequest,
} from "../model/types";

export const testResultsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение результатов тестов
    getTestResults: builder.query<TestResultsResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/test-results${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: ["TestResults"],
    }),

    // Получение результата теста по ID
    getTestResult: builder.query<TestResult, { id: string }>({
      query: ({ id }) => ({
        url: `/test-results/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "TestResults", id }],
    }),

    // Создание результата теста
    createTestResult: builder.mutation<TestResult, CreateTestResultRequest>({
      query: (body) => ({
        url: "/test-results/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TestResults", "Tests"],
    }),

    // Обновление результата теста
    updateTestResult: builder.mutation<
      TestResult,
      { id: string; body: UpdateTestResultRequest }
    >({
      query: ({ id, body }) => ({
        url: `/test-results/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["TestResults", "Tests"],
    }),

    // Удаление результата теста
    deleteTestResult: builder.mutation<void, string>({
      query: (id) => ({
        url: `/test-results/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TestResults"],
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

export type { TestResult };
