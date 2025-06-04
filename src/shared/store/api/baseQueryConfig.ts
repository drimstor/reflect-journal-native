import { tokenService, useI18nStore } from "@/src/shared/store";
import { API_URL } from "../../const";

// Базовая конфигурация для всех запросов
export const baseQueryConfig = {
  baseUrl: API_URL,
  prepareHeaders: async (headers: Headers) => {
    // Добавляем токен в заголовки
    const token = await tokenService.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    // Добавляем язык в заголовки
    const locale = useI18nStore.getState().locale;
    headers.set("Accept-Language", locale);

    return headers;
  },
};
