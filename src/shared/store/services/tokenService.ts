import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Платформо-специфичное хранилище
const storage = {
  // Сохранение данных
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      // Для веб используем localStorage
      localStorage.setItem(key, value);
    } else {
      // Для мобильных устройств используем SecureStore
      await SecureStore.setItemAsync(key, value);
    }
  },

  // Получение данных
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      // Для веб используем localStorage
      return localStorage.getItem(key);
    } else {
      // Для мобильных устройств используем SecureStore
      return await SecureStore.getItemAsync(key);
    }
  },

  // Удаление данных
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      // Для веб используем localStorage
      localStorage.removeItem(key);
    } else {
      // Для мобильных устройств используем SecureStore
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export const tokenService = {
  // Сохранение токенов в защищенном хранилище
  async setTokens(accessToken: string, refreshToken: string) {
    try {
      await storage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      return true;
    } catch (error) {
      console.error("Error saving tokens:", error);
      return false;
    }
  },

  // Получение access token из защищенного хранилища
  async getAccessToken() {
    try {
      return await storage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  // Получение refresh token из защищенного хранилища
  async getRefreshToken() {
    try {
      return await storage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  // Удаление всех токенов из защищенного хранилища
  async removeTokens() {
    try {
      await storage.removeItem(ACCESS_TOKEN_KEY);
      await storage.removeItem(REFRESH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error("Error removing tokens:", error);
      return false;
    }
  },

  // Проверка авторизации
  async isAuthenticated() {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  },

  // Добавим метод для проверки всех сохраненных данных
  async debugTokens() {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();

      console.log("Current tokens state:", {
        accessToken,
        refreshToken,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Debug error:", error);
      return null;
    }
  },
};
