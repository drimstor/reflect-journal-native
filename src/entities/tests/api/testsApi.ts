import { baseApi } from "../../../shared/api/baseApi";
import type {
  CreateTestRequest,
  CreateTestResultRequest,
  Test,
  TestResult,
  TestResultsResponse,
  TestsResponse,
  UpdateTestRequest,
  UpdateTestResultRequest,
} from "../model/types";

// Заготовка для API тестов
// Будет реализован после настройки RTK Query endpoints

/**
 * API для работы с тестами
 */
export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка тестов
    getTests: builder.query<TestsResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/tests${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Tests"],
    }),

    // Получение теста по ID
    getTest: builder.query<Test, string>({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tests", id }],
    }),

    // Создание теста
    createTest: builder.mutation<Test, CreateTestRequest>({
      query: (body) => ({
        url: "/tests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tests"],
    }),

    // Обновление теста
    updateTest: builder.mutation<Test, { id: string; data: UpdateTestRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/tests/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Tests", id },
          "Tests",
        ],
      }
    ),

    // Удаление теста
    deleteTest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tests"],
    }),

    // Получение результатов тестов
    getTestResults: builder.query<TestResultsResponse, { params?: string }>({
      query: ({ params }) => ({
        url: `/test-results${params ? `?${params}` : ""}`,
        method: "GET",
      }),
      providesTags: ["TestResults"],
    }),

    // Получение результата теста по ID
    getTestResult: builder.query<TestResult, string>({
      query: (id) => ({
        url: `/test-results/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "TestResults", id }],
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
      { id: string; data: UpdateTestResultRequest }
    >({
      query: ({ id, data }) => ({
        url: `/test-results/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TestResults", id },
        "TestResults",
      ],
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

// Экспорт хуков для использования в компонентах
export const {
  useGetTestsQuery,
  useGetTestQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetTestResultsQuery,
  useGetTestResultQuery,
  useCreateTestResultMutation,
  useUpdateTestResultMutation,
  useDeleteTestResultMutation,
} = testsApi;
