import { baseApi } from "@/src/shared/api/baseApi";
import { AffirmationResponse } from "../model/types";

export const affirmationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyAffirmation: builder.query<AffirmationResponse, void>({
      query: () => ({
        url: "/affirmations/daily",
        method: "GET",
      }),
      // Кэшируем на день, так как аффирмация меняется раз в день
      keepUnusedDataFor: 12 * 60 * 60, // 12 часа в секундах
    }),
    getDailyAdvice: builder.query<AffirmationResponse, void>({
      query: () => ({
        url: "/affirmations/advice/daily",
        method: "GET",
      }),
      // Кэшируем на день, так как совет меняется раз в день
      keepUnusedDataFor: 12 * 60 * 60, // 12 часа в секундах
    }),
  }),
});

export const {
  useGetDailyAffirmationQuery,
  useGetDailyAdviceQuery,
  useLazyGetDailyAffirmationQuery,
  useLazyGetDailyAdviceQuery,
} = affirmationsApi;
