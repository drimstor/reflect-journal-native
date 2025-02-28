import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { tokenService } from "@/src/shared/store";
import { baseQueryConfig } from "@/src/shared/store";

const mutex = new Mutex();

// Базовый запрос с конфигурацией
export const baseQuery = fetchBaseQuery(baseQueryConfig);

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = await tokenService.getRefreshToken();
        if (!refreshToken) {
          await tokenService.removeTokens();
          return result;
        }

        // Пытаемся обновить токен
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refresh_token: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { access_token, refresh_token } = refreshResult.data as {
            access_token: string;
            refresh_token: string;
          };

          // Сохраняем новые токены
          await tokenService.setTokens(access_token, refresh_token);

          // Повторяем изначальный запрос
          result = await baseQuery(args, api, extraOptions);
        } else {
          await tokenService.removeTokens();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
