/**
 * 認證服務
 * 處理Apple登入、登出以及認證狀態管理
 */

import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { useUserStore } from "../stores/userStore";
import { apiClient, type ApiUser, type AppleSignInApiRequest } from "./apiClient";
import { tokenService, type TokenData } from "./tokenService";

export interface AppleAuthResult {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    fullName?: {
      givenName?: string | null;
      familyName?: string | null;
    };
    identityToken?: string;
    authorizationCode?: string;
  };
  error?: string;
}

/**
 * 檢查Apple登入是否可用
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.warn("Apple Authentication availability check failed:", error);
    return false;
  }
};

/**
 * 執行Apple登入
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  try {
    // 檢查是否支援Apple登入
    const isAvailable = await isAppleAuthAvailable();
    if (!isAvailable) {
      return {
        success: false,
        error: "Apple登入不可用，請使用支援的設備",
      };
    }

    // 執行Apple登入
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });

    // 檢查認證結果
    if (credential.user) {
      return {
        success: true,
        user: {
          id: credential.user,
          email: credential.email || undefined,
          fullName: credential.fullName || undefined,
          identityToken: credential.identityToken || undefined,
          authorizationCode: credential.authorizationCode || undefined,
        },
      };
    } else {
      return {
        success: false,
        error: "登入過程中發生錯誤",
      };
    }
  } catch (error: any) {
    console.error("Apple Sign In error:", error);

    // 處理不同的錯誤類型
    if (error.code === "ERR_REQUEST_CANCELED") {
      return {
        success: false,
        error: "用戶取消登入",
      };
    } else if (error.code === "ERR_INVALID_RESPONSE") {
      return {
        success: false,
        error: "登入回應無效，請重試",
      };
    } else {
      return {
        success: false,
        error: error.message || "登入失敗，請重試",
      };
    }
  }
};

/**
 * 檢查現有的認證狀態
 */
export const getCredentialStateForUser = async (userID: string): Promise<AppleAuthentication.AppleAuthenticationCredentialState | null> => {
  try {
    const isAvailable = await isAppleAuthAvailable();
    if (!isAvailable) {
      return null;
    }

    return await AppleAuthentication.getCredentialStateAsync(userID);
  } catch (error) {
    console.error("Failed to get credential state:", error);
    return null;
  }
};

/**
 * 處理登入成功後的用戶資料更新
 */
export const handleSuccessfulLogin = async (appleUser: AppleAuthResult["user"]): Promise<boolean> => {
  if (!appleUser) return false;

  try {
    console.log("開始處理 Apple 登入後端驗證...");

    // 準備發送到後端的資料
    const apiRequest: AppleSignInApiRequest = {
      identity_token: appleUser.identityToken || "",
      authorization_code: appleUser.authorizationCode,
      user_info: appleUser.fullName
        ? {
            name: {
              firstName: appleUser.fullName.givenName || undefined,
              lastName: appleUser.fullName.familyName || undefined,
            },
          }
        : undefined,
    };

    // 發送到後端驗證
    const response = await apiClient.appleSignIn(apiRequest);

    if (!response.success || !response.data) {
      console.error("後端認證失敗:", response.error);
      throw new Error(response.error || "後端認證失敗");
    }

    const { access_token, token_type, expires_in, user } = response.data;

    // 儲存 token
    const tokenData: TokenData = {
      accessToken: access_token,
      tokenType: token_type,
      expiresIn: expires_in,
      expiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
    };

    const tokenStored = await tokenService.storeToken(tokenData, user.id);
    if (!tokenStored) {
      throw new Error("Token 儲存失敗");
    }

    // 將 API 用戶資料轉換為本地用戶資料格式
    const userData = convertApiUserToLocalUser(user);

    // 更新 store 狀態
    const { login } = useUserStore.getState();
    login(userData);

    console.log("用戶登入成功:", userData.username);
    return true;
  } catch (error) {
    console.error("處理登入失敗:", error);
    return false;
  }
};

/**
 * 將 API 用戶資料轉換為本地用戶資料格式
 */
const convertApiUserToLocalUser = (apiUser: ApiUser) => {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email || "",
    avatar: apiUser.avatar_url,
    membershipPlan: apiUser.membership_plan as "free" | "premium" | "enterprise",
    membershipExpiry: apiUser.membership_expiry ? new Date(apiUser.membership_expiry) : undefined,
    joinDate: new Date(apiUser.join_date),
    // Apple 認證資料
    appleUserId: apiUser.apple_user_id,
    appleIdentityToken: undefined, // 不在前端保存敏感資料
    appleAuthorizationCode: undefined, // 不在前端保存敏感資料
    preferences: {
      language: apiUser.language as "zh-TW" | "zh-CN" | "en",
      notifications: apiUser.notifications_enabled,
      privacy: {
        allowDataAnalytics: apiUser.data_analytics_allowed,
        allowPersonalization: apiUser.personalization_allowed,
      },
    },
  };
};

/**
 * 登出處理
 */
export const signOut = async () => {
  try {
    // 嘗試通知後端登出
    const hasValidToken = await tokenService.getValidToken();
    if (hasValidToken) {
      try {
        await apiClient.logout();
      } catch (error) {
        console.warn("後端登出請求失敗:", error);
        // 即使後端登出失敗，仍繼續本地登出流程
      }
    }

    // 清除本地儲存
    await tokenService.clearToken();

    // 更新 store 狀態
    const { logout } = useUserStore.getState();
    logout();

    console.log("用戶已登出");
  } catch (error) {
    console.error("登出過程中發生錯誤:", error);
    // 確保至少執行本地清理
    const { logout } = useUserStore.getState();
    logout();
  }
};

/**
 * 驗證當前登入狀態
 */
export const validateCurrentAuth = async (): Promise<boolean> => {
  try {
    const { user, isLoggedIn } = useUserStore.getState();

    if (!isLoggedIn || !user) {
      return false;
    }

    // 首先檢查本地 token 狀態
    const isTokenValid = await tokenService.isTokenValid();
    if (!isTokenValid) {
      console.log("Token 已過期，嘗試刷新...");
      const refreshed = await tokenService.refreshToken();
      if (!refreshed) {
        console.log("Token 刷新失敗，執行登出");
        await signOut();
        return false;
      }
    }

    // 檢查 Apple 認證狀態（如果有 Apple User ID）
    if (user.appleUserId) {
      const credentialState = await getCredentialStateForUser(user.appleUserId);
      if (credentialState !== AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) {
        console.log("Apple 認證狀態已失效，執行登出");
        await signOut();
        return false;
      }
    }

    // 嘗試從後端獲取用戶資料以驗證會話
    try {
      const response = await apiClient.getCurrentUser();
      if (!response.success) {
        console.log("後端會話驗證失敗，執行登出");
        await signOut();
        return false;
      }

      // 可選：同步最新的用戶資料
      if (response.data) {
        const userData = convertApiUserToLocalUser(response.data);
        const { login } = useUserStore.getState();
        login(userData);
      }
    } catch (error) {
      console.warn("後端會話驗證出錯:", error);
      // 網路錯誤時不立即登出，保持本地狀態
    }

    return true;
  } catch (error) {
    console.error("驗證登入狀態時發生錯誤:", error);
    await signOut();
    return false;
  }
};

/**
 * 初始化認證服務
 * 應用啟動時調用
 */
export const initializeAuth = async (): Promise<boolean> => {
  try {
    console.log("初始化認證服務...");

    // 初始化 token 服務
    const hasValidToken = await tokenService.initialize();
    if (!hasValidToken) {
      console.log("沒有有效的 token");
      return false;
    }

    // 嘗試獲取用戶資料
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        const userData = convertApiUserToLocalUser(response.data);
        const { login } = useUserStore.getState();
        login(userData);

        console.log("自動登入成功:", userData.username);
        return true;
      }
    } catch (error) {
      console.warn("自動登入失敗:", error);
    }

    // 清理無效的 token
    await tokenService.clearToken();
    return false;
  } catch (error) {
    console.error("初始化認證服務失敗:", error);
    return false;
  }
};
