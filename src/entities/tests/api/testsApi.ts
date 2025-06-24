import { baseApi } from "@/src/shared/api/baseApi";
import type { Test, TestsResponse } from "../model/types";

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
    getTest: builder.query<Test, { id: string }>({
      query: ({ id }) => ({
        url: `/tests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "Tests", id }],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useGetTestsQuery, useGetTestQuery } = testsApi;
export type { Test };
