/**
 * AI戀愛助手相關的類型定義
 * 包含助手基本資料、個性分析、對話模擬等功能的數據結構
 */

// 助手類型分類
export type AssistantType =
  | 'emotional_support'    // 情感支持
  | 'conversation_coach'   // 對話教練
  | 'dating_advisor'       // 約會顧問
  | 'relationship_guide'   // 關係指導
  | 'confidence_builder'   // 自信建立
  | 'communication_expert' // 溝通專家

// 性別類型
export type Gender = 'male' | 'female' | 'non_binary'

// 個性特質類型
export type PersonalityTrait =
  | 'gentle'        // 溫柔
  | 'cheerful'      // 開朗
  | 'intellectual'  // 知性
  | 'humorous'      // 幽默
  | 'calm'          // 沉穩
  | 'passionate'    // 熱情
  | 'mysterious'    // 神秘
  | 'caring'        // 體貼

// 助手基本資料介面
export interface AIAssistant {
  id: string
  name: string
  avatar: string
  age: number
  gender: Gender
  type: AssistantType
  tagline: string         // 一句話描述
  description: string     // 詳細描述

  // 個性相關
  personality: PersonalityTrait[]
  specialties: string[]   // 專長領域

  // 統計資料
  stats: {
    total_conversations: number
    average_rating: number
    success_rate: number
    online_status: 'online' | 'busy' | 'offline'
  }

  // 語音特性
  voice_characteristics?: {
    tone: 'warm' | 'professional' | 'friendly' | 'gentle'
    speed: 'slow' | 'normal' | 'fast'
    accent?: string
  }

  // 可用時間
  available_hours: {
    start: string  // "09:00"
    end: string    // "23:00"
    timezone: string
  }

  // 時間戳記
  created_at: string
  updated_at: string
}

// 用戶上傳的照片資料
export interface UploadedPhoto {
  id: string
  url: string
  type: 'profile' | 'lifestyle'  // 大頭照或生活照
  description?: string
  analysis_result?: PhotoAnalysis
  uploaded_at: string
}

// 照片分析結果
export interface PhotoAnalysis {
  appearance: {
    facial_features: string[]
    style_description: string
    estimated_age_range: string
  }
  lifestyle: {
    interests: string[]
    social_environment: string
    activity_level: string
  }
  personality_indicators: string[]
}

// 對話記錄資料
export interface ConversationRecord {
  id: string
  content: string
  timestamp: string
  participant: 'user' | 'target'
  analysis_result?: ConversationAnalysis
}

// 對話分析結果
export interface ConversationAnalysis {
  communication_style: string
  emotional_tone: string
  topic_preferences: string[]
  response_patterns: string[]
  relationship_stage: 'initial' | 'getting_to_know' | 'developing' | 'established'
}

// 個性檔案分析結果
export interface PersonalityProfile {
  id: string
  target_name: string

  // 基本特徵
  estimated_personality: {
    mbti_type?: string
    dominant_traits: PersonalityTrait[]
    communication_style: string
  }

  // 興趣愛好
  interests: {
    primary: string[]
    secondary: string[]
    lifestyle_preferences: string[]
  }

  // 溝通模式
  communication_patterns: {
    preferred_topics: string[]
    response_style: string
    humor_appreciation: string
    emotional_expression: string
  }

  // 建議策略
  interaction_suggestions: {
    conversation_starters: string[]
    topics_to_avoid: string[]
    compliment_styles: string[]
    date_ideas: string[]
  }

  // 分析準確度
  confidence_score: number  // 0-100
  data_completeness: number // 0-100

  created_at: string
  updated_at: string
}

// 對話模擬會話
export interface SimulationSession {
  id: string
  assistant_id: string
  target_profile_id: string
  scenario: ConversationScenario

  // 會話記錄
  messages: SimulationMessage[]

  // 建議記錄
  suggestions_used: string[]

  // 會話評估
  performance_score?: number
  feedback?: string

  created_at: string
  ended_at?: string
}

// 對話場景
export interface ConversationScenario {
  id: string
  name: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  context: string
  goals: string[]
}

// 模擬對話訊息
export interface SimulationMessage {
  id: string
  sender: 'user' | 'ai_assistant'
  content: string
  timestamp: string
  suggestions?: string[]  // AI建議的回應選項
  selected_suggestion?: string
}

// 助手創建請求
export interface CreateAssistantRequest {
  name: string
  type: AssistantType
  photos: File[]
  conversation_records: string[]
  additional_info: {
    interests: string[]
    personality_notes: string
    relationship_context: string
  }
}

// API 回應介面
export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}