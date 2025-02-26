import { tokenService } from "@/src/shared/store";
import { API_URL } from "../../const";

// Базовая конфигурация для всех запросов
export const baseQueryConfig = {
  baseUrl: API_URL,
  prepareHeaders: async (headers: Headers) => {
    const token = await tokenService.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
};
