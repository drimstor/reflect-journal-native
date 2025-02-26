import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      return true;
    } catch (error) {
      console.error("Error saving tokens:", error);
      return false;
    }
  },

  // Получение access token из защищенного хранилища
  async getAccessToken() {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  // Получение refresh token из защищенного хранилища
  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  // Удаление всех токенов из защищенного хранилища
  async removeTokens() {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
