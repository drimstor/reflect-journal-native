import { baseApi } from "@/src/shared/api/baseApi";
import { AffirmationResponse, DailyAdviceRequest } from "../model/types";

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
    getDailyAdvice: builder.query<AffirmationResponse, DailyAdviceRequest>({
      query: ({ excluded_categories }) => {
        // Формируем URL с правильной передачей массива для FastAPI
        const params = new URLSearchParams();
        if (excluded_categories && excluded_categories.length > 0) {
          excluded_categories.forEach((category) => {
            params.append("excluded_categories", category);
          });
        }

        return {
          url: `/affirmations/advice/daily${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
        };
      },
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
