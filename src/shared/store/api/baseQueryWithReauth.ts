import { PATHS } from "@/src/shared/const";
import {
  baseQueryConfig,
  handleError,
  tokenService,
  useBottomSheetStore,
} from "@/src/shared/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

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
          // Редиректим на экран авторизации через глобальную навигацию
          useBottomSheetStore.getState().setNavigation(true, PATHS.AUTH, {});
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
          // Редиректим на экран авторизации при неудачном обновлении токена
          useBottomSheetStore.getState().setNavigation(true, PATHS.AUTH, {});
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  if (result.error) handleError(api.dispatch)(result.error);

  return result;
};
