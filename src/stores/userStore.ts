/**
 * 用戶狀態管理
 * 管理用戶個人資料、會員狀態、使用統計等
 */

import { create } from 'zustand'

// 會員方案類型
export type MembershipPlan = 'free' | 'premium' | 'enterprise'

// 用戶介面
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  membershipPlan: MembershipPlan
  membershipExpiry?: Date
  joinDate: Date
  preferences: {
    language: 'zh-TW' | 'zh-CN' | 'en'
    notifications: boolean
    privacy: {
      allowDataAnalytics: boolean
      allowPersonalization: boolean
    }
  }
}

// 使用統計介面
export interface UsageStats {
  totalConversations: number
  totalAPIUsage: number
  totalCost: number
  monthlyUsage: {
    conversations: number
    apiCalls: number
    cost: number
  }
  remainingQuota?: number // 剩餘額度（免費用戶）
}

// 應用設定介面
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
  soundEnabled: boolean
  vibrationEnabled: boolean
  autoSaveConversations: boolean
}

interface UserStore {
  // 用戶狀態
  user: User | null
  usageStats: UsageStats | null
  appSettings: AppSettings
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setUsageStats: (stats: UsageStats) => void
  setAppSettings: (settings: Partial<AppSettings>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // 用戶操作
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  updatePreferences: (preferences: Partial<User['preferences']>) => void
  upgradeMembership: (plan: MembershipPlan, expiry?: Date) => void

  // 使用統計更新
  incrementConversation: () => void
  addAPIUsage: (cost: number) => void
  updateMonthlyStats: (stats: Partial<UsageStats['monthlyUsage']>) => void

  // 重置狀態
  reset: () => void
}

const defaultAppSettings: AppSettings = {
  theme: 'auto',
  fontSize: 'medium',
  soundEnabled: true,
  vibrationEnabled: true,
  autoSaveConversations: true,
}

export const useUserStore = create<UserStore>((set, get) => ({
  // 初始狀態
  user: null,
  usageStats: null,
  appSettings: defaultAppSettings,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  // 基本設置操作
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setUsageStats: (stats) => set({ usageStats: stats }),
  setAppSettings: (settings) =>
    set(state => ({
      appSettings: { ...state.appSettings, ...settings }
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // 用戶操作
  login: (user) => set({
    user,
    isLoggedIn: true,
    error: null
  }),

  logout: () => set({
    user: null,
    isLoggedIn: false,
    usageStats: null,
    error: null
  }),

  updateProfile: (updates) =>
    set(state => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),

  updatePreferences: (preferences) =>
    set(state => ({
      user: state.user ? {
        ...state.user,
        preferences: { ...state.user.preferences, ...preferences }
      } : null
    })),

  upgradeMembership: (plan, expiry) =>
    set(state => ({
      user: state.user ? {
        ...state.user,
        membershipPlan: plan,
        membershipExpiry: expiry
      } : null
    })),

  // 使用統計更新
  incrementConversation: () =>
    set(state => ({
      usageStats: state.usageStats ? {
        ...state.usageStats,
        totalConversations: state.usageStats.totalConversations + 1,
        monthlyUsage: {
          ...state.usageStats.monthlyUsage,
          conversations: state.usageStats.monthlyUsage.conversations + 1
        }
      } : null
    })),

  addAPIUsage: (cost) =>
    set(state => ({
      usageStats: state.usageStats ? {
        ...state.usageStats,
        totalAPIUsage: state.usageStats.totalAPIUsage + 1,
        totalCost: state.usageStats.totalCost + cost,
        monthlyUsage: {
          ...state.usageStats.monthlyUsage,
          apiCalls: state.usageStats.monthlyUsage.apiCalls + 1,
          cost: state.usageStats.monthlyUsage.cost + cost
        }
      } : null
    })),

  updateMonthlyStats: (stats) =>
    set(state => ({
      usageStats: state.usageStats ? {
        ...state.usageStats,
        monthlyUsage: { ...state.usageStats.monthlyUsage, ...stats }
      } : null
    })),

  // 重置所有狀態
  reset: () => set({
    user: null,
    usageStats: null,
    appSettings: defaultAppSettings,
    isLoggedIn: false,
    isLoading: false,
    error: null
  })
}))

// 選擇器輔助函數
export const selectMembershipInfo = (state: UserStore) => ({
  plan: state.user?.membershipPlan,
  expiry: state.user?.membershipExpiry,
  isPremium: state.user?.membershipPlan !== 'free'
})

export const selectUsageQuota = (state: UserStore) => ({
  totalUsage: state.usageStats?.totalAPIUsage || 0,
  remaining: state.usageStats?.remainingQuota,
  monthlyCost: state.usageStats?.monthlyUsage.cost || 0
})