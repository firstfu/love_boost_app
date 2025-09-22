/**
 * API 客戶端服務
 * 處理與後端 API 的 HTTP 通信
 */

import { Platform } from "react-native";

// API 配置
const API_CONFIG = {
  baseURL: __DEV__ ? (Platform.OS === "ios" ? "http://localhost:8001" : "http://10.0.2.2:8001") : "https://api.loveboost.app", // 生產環境 URL
  timeout: 10000,
  version: "v1",
};

export const API_ENDPOINTS = {
  auth: {
    apple: "/auth/apple",
    refresh: "/auth/refresh",
    me: "/auth/me",
    logout: "/auth/logout",
  },
};

// API 回應類型定義
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// 用戶相關類型
export interface ApiUser {
  id: string;
  apple_user_id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  membership_plan: "free" | "premium" | "enterprise";
  membership_expiry?: string;
  join_date: string;
  total_conversations: number;
  total_api_usage: number;
  total_cost: number;
  monthly_conversations: number;
  monthly_api_calls: number;
  monthly_cost: number;
  remaining_quota?: number;
  language: string;
  notifications_enabled: boolean;
  data_analytics_allowed: boolean;
  personalization_allowed: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface AppleSignInApiRequest {
  identity_token: string;
  authorization_code?: string;
  user_info?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface AuthApiResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: ApiUser;
}

/**
 * API 客戶端類別
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${API_CONFIG.baseURL}/api/${API_CONFIG.version}`;
    this.timeout = API_CONFIG.timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * 設定認證 token
   */
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * 移除認證 token
   */
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * 發送 HTTP 請求
   */
  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      headers?: Record<string, string>;
      body?: any;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = this.timeout } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    try {
      console.log(`[API] ${method} ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData: any;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log(`[API] ${method} ${url} - ${response.status}`);

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          status: response.status,
        };
      } else {
        let errorMessage = "請求失敗";

        if (responseData?.detail) {
          errorMessage = typeof responseData.detail === 'string' ? responseData.detail : JSON.stringify(responseData.detail);
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          errorMessage = typeof responseData.error === 'string' ? responseData.error : JSON.stringify(responseData.error);
        }

        console.error(`[API] Error ${response.status}: ${errorMessage}`);

        return {
          success: false,
          error: errorMessage,
          status: response.status,
        };
      }
    } catch (error: any) {
      console.error(`[API] Request failed:`, error);

      let errorMessage = "網路連接失敗";
      if (error.name === "AbortError") {
        errorMessage = "請求超時";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        status: 0,
      };
    }
  }

  /**
   * GET 請求
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  /**
   * POST 請求
   */
  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  /**
   * PUT 請求
   */
  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  /**
   * DELETE 請求
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }

  // === 認證相關 API ===

  /**
   * Apple 登入
   */
  async appleSignIn(data: AppleSignInApiRequest): Promise<ApiResponse<AuthApiResponse>> {
    return this.post<AuthApiResponse>(API_ENDPOINTS.auth.apple, data);
  }

  /**
   * 刷新 token
   */
  async refreshToken(currentToken: string): Promise<ApiResponse<Partial<AuthApiResponse>>> {
    return this.post<Partial<AuthApiResponse>>(API_ENDPOINTS.auth.refresh, {
      current_token: currentToken,
    });
  }

  /**
   * 獲取當前用戶資訊
   */
  async getCurrentUser(): Promise<ApiResponse<ApiUser>> {
    return this.get<ApiUser>(API_ENDPOINTS.auth.me);
  }

  /**
   * 登出
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(API_ENDPOINTS.auth.logout);
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string }>> {
    // 健康檢查端點不在 API prefix 下，直接使用完整 URL
    const url = `${API_CONFIG.baseURL}/health`;

    try {
      console.log(`[API] GET ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      console.log(`[API] GET ${url} - ${response.status}`);

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          status: response.status,
        };
      } else {
        return {
          success: false,
          error: responseData?.detail || "健康檢查失敗",
          status: response.status,
        };
      }
    } catch (error: any) {
      console.error(`[API] Health check failed:`, error);
      return {
        success: false,
        error: "網路連接失敗",
        status: 0,
      };
    }
  }
}

// 導出全域實例
export const apiClient = new ApiClient();

// 便利方法
export const setApiAuthToken = (token: string) => {
  apiClient.setAuthToken(token);
};

export const removeApiAuthToken = () => {
  apiClient.removeAuthToken();
};
