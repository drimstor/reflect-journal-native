import { baseApi } from "@/src/shared/api/baseApi";
import { AssistantStrategy } from "../model/types";

export const assistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssistantStrategy: builder.query<AssistantStrategy, void>({
      query: () => ({
        url: "/assistant/strategy",
        method: "GET",
      }),
      providesTags: ["AssistantStrategy"],
    }),

    createAssistantStrategy: builder.mutation<
      AssistantStrategy,
      Partial<AssistantStrategy>
    >({
      query: (data) => ({
        url: "/assistant/strategy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssistantStrategy"],
    }),

    updateAssistantStrategy: builder.mutation<
      AssistantStrategy,
      Partial<AssistantStrategy>
    >({
      query: (data) => ({
        url: "/assistant/strategy",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssistantStrategy"],
    }),
  }),
});

export const {
  useGetAssistantStrategyQuery,
  useCreateAssistantStrategyMutation,
  useUpdateAssistantStrategyMutation,
} = assistantApi;
