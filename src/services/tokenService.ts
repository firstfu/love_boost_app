/**
 * Token 管理服務
 * 處理認證 token 的安全儲存、讀取和管理
 */

import * as SecureStore from "expo-secure-store";
import { apiClient, removeApiAuthToken, setApiAuthToken } from "./apiClient";

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  TOKEN_EXPIRY: "token_expiry",
  USER_ID: "user_id",
} as const;

export interface TokenData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
}

export interface StoredTokenInfo {
  token: string;
  expiresAt: number;
  userId: string;
}

/**
 * Token 服務類別
 */
class TokenService {
  private tokenRefreshPromise: Promise<boolean> | null = null;

  /**
   * 儲存認證 token
   */
  async storeToken(tokenData: TokenData, userId: string): Promise<boolean> {
    try {
      const expiresAt = Date.now() + tokenData.expiresIn * 1000;

      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString()),
        SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, userId),
      ]);

      // 設定到 API 客戶端
      setApiAuthToken(tokenData.accessToken);

      console.log("Token stored successfully");
      return true;
    } catch (error) {
      console.error("Error storing token:", error);
      return false;
    }
  }

  /**
   * 取得儲存的 token 資訊
   */
  async getStoredTokenInfo(): Promise<StoredTokenInfo | null> {
    try {
      const [token, expiresAtStr, userId] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
        SecureStore.getItemAsync(STORAGE_KEYS.USER_ID),
      ]);

      if (!token || !expiresAtStr || !userId) {
        return null;
      }

      return {
        token,
        expiresAt: parseInt(expiresAtStr, 10),
        userId,
      };
    } catch (error) {
      console.error("Error getting stored token info:", error);
      return null;
    }
  }

  /**
   * 檢查 token 是否有效
   */
  async isTokenValid(): Promise<boolean> {
    const tokenInfo = await this.getStoredTokenInfo();
    if (!tokenInfo) {
      return false;
    }

    // 檢查是否過期（提前 5 分鐘過期以確保安全）
    const bufferTime = 5 * 60 * 1000; // 5 分鐘
    const isNotExpired = Date.now() < tokenInfo.expiresAt - bufferTime;

    return isNotExpired;
  }

  /**
   * 取得有效的 token
   * 如果 token 即將過期，會自動刷新
   */
  async getValidToken(): Promise<string | null> {
    const tokenInfo = await this.getStoredTokenInfo();
    if (!tokenInfo) {
      return null;
    }

    // 如果 token 仍然有效，直接返回
    if (await this.isTokenValid()) {
      setApiAuthToken(tokenInfo.token);
      return tokenInfo.token;
    }

    // 嘗試刷新 token
    const refreshed = await this.refreshToken();
    if (refreshed) {
      const newTokenInfo = await this.getStoredTokenInfo();
      return newTokenInfo?.token || null;
    }

    return null;
  }

  /**
   * 刷新 token
   */
  async refreshToken(): Promise<boolean> {
    // 防止並發刷新
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this._performTokenRefresh();
    const result = await this.tokenRefreshPromise;
    this.tokenRefreshPromise = null;

    return result;
  }

  /**
   * 執行 token 刷新
   */
  private async _performTokenRefresh(): Promise<boolean> {
    try {
      const tokenInfo = await this.getStoredTokenInfo();
      if (!tokenInfo) {
        console.log("No token to refresh");
        return false;
      }

      console.log("Refreshing token...");

      // 暫時設定舊 token 來進行 API 請求
      setApiAuthToken(tokenInfo.token);

      const response = await apiClient.refreshToken(tokenInfo.token);

      if (response.success && response.data) {
        const { access_token, token_type, expires_in } = response.data;

        if (access_token && expires_in) {
          const newTokenData: TokenData = {
            accessToken: access_token,
            tokenType: token_type || "bearer",
            expiresIn: expires_in,
            expiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
          };

          const stored = await this.storeToken(newTokenData, tokenInfo.userId);
          if (stored) {
            console.log("Token refreshed successfully");
            return true;
          }
        }
      }

      console.error("Token refresh failed:", response.error);
      await this.clearToken();
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await this.clearToken();
      return false;
    }
  }

  /**
   * 清除儲存的 token
   */
  async clearToken(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID),
      ]);

      removeApiAuthToken();
      console.log("Token cleared successfully");
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  }

  /**
   * 初始化 token 服務
   * 應用啟動時調用，自動設定有效的 token
   */
  async initialize(): Promise<boolean> {
    try {
      const validToken = await this.getValidToken();
      if (validToken) {
        console.log("Token service initialized with valid token");
        return true;
      } else {
        console.log("No valid token found during initialization");
        return false;
      }
    } catch (error) {
      console.error("Error initializing token service:", error);
      return false;
    }
  }

  /**
   * 檢查 token 狀態
   */
  async getTokenStatus(): Promise<{
    hasToken: boolean;
    isValid: boolean;
    expiresAt?: Date;
    userId?: string;
  }> {
    const tokenInfo = await this.getStoredTokenInfo();

    if (!tokenInfo) {
      return {
        hasToken: false,
        isValid: false,
      };
    }

    const isValid = await this.isTokenValid();

    return {
      hasToken: true,
      isValid,
      expiresAt: new Date(tokenInfo.expiresAt),
      userId: tokenInfo.userId,
    };
  }
}

// 導出全域實例
export const tokenService = new TokenService();
