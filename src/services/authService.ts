/**
 * 認證服務
 * 處理Apple登入、登出以及認證狀態管理
 */

import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'
import { useUserStore } from '../stores/userStore'

export interface AppleAuthResult {
  success: boolean
  user?: {
    id: string
    email?: string
    fullName?: {
      givenName?: string | null
      familyName?: string | null
    }
    identityToken?: string
    authorizationCode?: string
  }
  error?: string
}

/**
 * 檢查Apple登入是否可用
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    return false
  }

  try {
    return await AppleAuthentication.isAvailableAsync()
  } catch (error) {
    console.warn('Apple Authentication availability check failed:', error)
    return false
  }
}

/**
 * 執行Apple登入
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  try {
    // 檢查是否支援Apple登入
    const isAvailable = await isAppleAuthAvailable()
    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple登入不可用，請使用支援的設備'
      }
    }

    // 執行Apple登入
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

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
        }
      }
    } else {
      return {
        success: false,
        error: '登入過程中發生錯誤'
      }
    }
  } catch (error: any) {
    console.error('Apple Sign In error:', error)

    // 處理不同的錯誤類型
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return {
        success: false,
        error: '用戶取消登入'
      }
    } else if (error.code === 'ERR_INVALID_RESPONSE') {
      return {
        success: false,
        error: '登入回應無效，請重試'
      }
    } else {
      return {
        success: false,
        error: error.message || '登入失敗，請重試'
      }
    }
  }
}

/**
 * 檢查現有的認證狀態
 */
export const getCredentialStateForUser = async (userID: string): Promise<AppleAuthentication.AppleAuthenticationCredentialState | null> => {
  try {
    const isAvailable = await isAppleAuthAvailable()
    if (!isAvailable) {
      return null
    }

    return await AppleAuthentication.getCredentialStateAsync(userID)
  } catch (error) {
    console.error('Failed to get credential state:', error)
    return null
  }
}

/**
 * 處理登入成功後的用戶資料更新
 */
export const handleSuccessfulLogin = async (appleUser: AppleAuthResult['user']) => {
  if (!appleUser) return

  const { login } = useUserStore.getState()

  // 建立用戶資料
  const userData = {
    id: appleUser.id,
    username: appleUser.fullName
      ? `${appleUser.fullName.givenName || ''} ${appleUser.fullName.familyName || ''}`.trim()
      : appleUser.email?.split('@')[0] || 'User',
    email: appleUser.email || '',
    avatar: undefined,
    membershipPlan: 'free' as const,
    joinDate: new Date(),
    // 儲存 Apple 認證資料
    appleUserId: appleUser.id,
    appleIdentityToken: appleUser.identityToken,
    appleAuthorizationCode: appleUser.authorizationCode,
    preferences: {
      language: 'zh-TW' as const,
      notifications: true,
      privacy: {
        allowDataAnalytics: true,
        allowPersonalization: true,
      }
    }
  }

  // 更新store狀態
  login(userData)

  // TODO: 這裡可以加入與後端API的整合
  // - 將identityToken發送到後端驗證
  // - 獲取或創建用戶帳戶
  // - 同步用戶資料和設定

  console.log('用戶登入成功:', userData.username)
}

/**
 * 登出處理
 */
export const signOut = async () => {
  const { logout } = useUserStore.getState()
  logout()
  console.log('用戶已登出')
}

/**
 * 驗證當前登入狀態
 */
export const validateCurrentAuth = async (): Promise<boolean> => {
  const { user, isLoggedIn } = useUserStore.getState()

  if (!isLoggedIn || !user) {
    return false
  }

  // 檢查Apple認證狀態
  const credentialState = await getCredentialStateForUser(user.id)

  if (credentialState === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) {
    return true
  } else {
    // 認證狀態已失效，執行登出
    await signOut()
    return false
  }
}