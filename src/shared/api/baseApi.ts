import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/shared/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Journals"],
  endpoints: () => ({}),
});

// Экспортируем хуки
export const {} = baseApi;
