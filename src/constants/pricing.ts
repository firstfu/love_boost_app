/**
 * 定價方案配置
 * 包含所有訂閱方案的詳細信息和功能定義
 */

// 訂閱方案類型
export type PricingPlan = 'basic' | 'advanced' | 'professional'

// 計費周期類型
export type BillingCycle = 'monthly' | 'yearly'

// 方案功能項目
export interface PlanFeature {
  name: string
  description: string
  included: boolean | string // true/false 或具體描述如 "5個"
  highlight?: boolean // 是否為重點功能
}

// 完整方案定義
export interface PricingPlanConfig {
  id: PricingPlan
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  originalYearlyPrice: number // 年付原價
  popularBadge?: boolean
  features: PlanFeature[]
  limitations: {
    maxCompanions: number
    monthlyAnalysis: number | 'unlimited'
    voiceCallHours: number | 'unlimited'
    photoAnalysis: number | 'unlimited'
    priority: 'standard' | 'high' | 'premium'
  }
}

// 三層定價方案配置
export const PRICING_PLANS: PricingPlanConfig[] = [
  {
    id: 'basic',
    name: '基礎方案',
    description: '適合初學者探索AI助手功能',
    monthlyPrice: 1990,
    yearlyPrice: 19900,
    originalYearlyPrice: 23880,
    features: [
      {
        name: 'AI 助手數量',
        description: '可創建的個人化AI助手數量',
        included: '最多 2 個',
        highlight: true
      },
      {
        name: '深度分析',
        description: '每月可執行的詳細心理分析次數',
        included: '50 次/月'
      },
      {
        name: '對話模擬',
        description: '無限制的文字對話練習',
        included: true
      },
      {
        name: '語音通話',
        description: '與AI助手的語音對話功能',
        included: '10 小時/月'
      },
      {
        name: '照片分析',
        description: '上傳照片進行個性與風格分析',
        included: '10 張/月'
      },
      {
        name: '基礎建議',
        description: '基本的對話建議和回應策略',
        included: true
      },
      {
        name: '客戶支援',
        description: '技術支援服務',
        included: '標準支援'
      }
    ],
    limitations: {
      maxCompanions: 2,
      monthlyAnalysis: 50,
      voiceCallHours: 10,
      photoAnalysis: 10,
      priority: 'standard'
    }
  },
  {
    id: 'advanced',
    name: '進階方案',
    description: '完整功能體驗，最受歡迎的選擇',
    monthlyPrice: 3990,
    yearlyPrice: 39900,
    originalYearlyPrice: 47880,
    popularBadge: true,
    features: [
      {
        name: 'AI 助手數量',
        description: '可創建的個人化AI助手數量',
        included: '最多 5 個',
        highlight: true
      },
      {
        name: '深度分析',
        description: '無限制的詳細心理分析',
        included: '無限制',
        highlight: true
      },
      {
        name: '對話模擬',
        description: '無限制的文字對話練習',
        included: true
      },
      {
        name: '語音通話',
        description: '無限制的語音對話功能',
        included: '無限制',
        highlight: true
      },
      {
        name: '照片分析',
        description: '無限制的照片分析功能',
        included: '無限制'
      },
      {
        name: '高級建議',
        description: '智能對話建議和高級策略分析',
        included: true,
        highlight: true
      },
      {
        name: '詳細報告',
        description: '深度關係洞察和分析報告',
        included: true
      },
      {
        name: '客戶支援',
        description: '優先技術支援服務',
        included: '優先支援'
      }
    ],
    limitations: {
      maxCompanions: 5,
      monthlyAnalysis: 'unlimited',
      voiceCallHours: 'unlimited',
      photoAnalysis: 'unlimited',
      priority: 'high'
    }
  },
  {
    id: 'professional',
    name: '專業方案',
    description: '專業級功能，適合重度使用者',
    monthlyPrice: 7990,
    yearlyPrice: 79900,
    originalYearlyPrice: 95880,
    features: [
      {
        name: 'AI 助手數量',
        description: '無限制創建個人化AI助手',
        included: '無限制',
        highlight: true
      },
      {
        name: '深度分析',
        description: '無限制的專業級心理分析',
        included: '無限制',
        highlight: true
      },
      {
        name: '對話模擬',
        description: '無限制的高品質對話練習',
        included: true
      },
      {
        name: '語音通話',
        description: '無限制的高清語音對話',
        included: '無限制'
      },
      {
        name: '照片分析',
        description: '無限制的專業級照片分析',
        included: '無限制'
      },
      {
        name: '專業建議',
        description: '客製化策略和專業級建議',
        included: true,
        highlight: true
      },
      {
        name: '專家報告',
        description: '專業級關係分析和策略報告',
        included: true,
        highlight: true
      },
      {
        name: '專屬支援',
        description: '24/7 專屬客戶支援服務',
        included: '專屬支援',
        highlight: true
      },
      {
        name: 'API 訪問',
        description: '開發者API接口訪問權限',
        included: true
      }
    ],
    limitations: {
      maxCompanions: -1, // -1 表示無限制
      monthlyAnalysis: 'unlimited',
      voiceCallHours: 'unlimited',
      photoAnalysis: 'unlimited',
      priority: 'premium'
    }
  }
]

// 年付折扣計算
export const YEARLY_DISCOUNT = 0.17 // 17% 折扣 (8.3折)

// 定價相關常數
export const PRICING_CONFIG = {
  currency: 'TWD',
  currencySymbol: 'NT$',
  trialDays: 7,
  refundDays: 30,
  yearlyDiscountText: '年付享83折優惠',
  popularPlanId: 'advanced' as PricingPlan
}

// 支付方式配置
export interface PaymentMethod {
  id: string
  name: string
  description: string
  processingFee: number // 百分比
  icon: string
  enabled: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: '信用卡',
    description: 'Visa / MasterCard / JCB',
    processingFee: 2.8,
    icon: 'card',
    enabled: true
  },
  {
    id: 'atm_transfer',
    name: 'ATM轉帳',
    description: '銀行ATM或網路銀行轉帳',
    processingFee: 1.0,
    icon: 'business',
    enabled: true
  },
  {
    id: 'convenience_store',
    name: '超商付款',
    description: '7-11 / 全家 / 萊爾富',
    processingFee: 1.5,
    icon: 'storefront',
    enabled: true
  }
]

// 幫助函數
export const getPlanById = (planId: PricingPlan): PricingPlanConfig | undefined => {
  return PRICING_PLANS.find(plan => plan.id === planId)
}

export const getPopularPlan = (): PricingPlanConfig => {
  return PRICING_PLANS.find(plan => plan.popularBadge) || PRICING_PLANS[1]
}

export const calculateYearlySavings = (monthlyPrice: number): number => {
  const yearlyTotal = monthlyPrice * 12
  const yearlyPrice = Math.round(yearlyTotal * (1 - YEARLY_DISCOUNT))
  return yearlyTotal - yearlyPrice
}

export const formatPrice = (price: number): string => {
  return `${PRICING_CONFIG.currencySymbol}${price.toLocaleString()}`
}

export const getPlanLimitText = (plan: PricingPlanConfig, feature: keyof PricingPlanConfig['limitations']): string => {
  const limit = plan.limitations[feature]

  if (limit === 'unlimited' || limit === -1) {
    return '無限制'
  }

  switch (feature) {
    case 'maxCompanions':
      return `最多 ${limit} 個`
    case 'monthlyAnalysis':
      return `${limit} 次/月`
    case 'voiceCallHours':
      return `${limit} 小時/月`
    case 'photoAnalysis':
      return `${limit} 張/月`
    case 'priority':
      return limit === 'standard' ? '標準' : limit === 'high' ? '優先' : '專屬'
    default:
      return String(limit)
  }
}