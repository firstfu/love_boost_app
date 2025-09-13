/**
 * AI戀愛模擬系統相關的類型定義
 * 包含AI分身基本資料、個性分析、對話模擬等功能的數據結構
 */

// 性別類型
export type Gender = 'female' | 'male' | 'non_binary'

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
  | 'playful'       // 俏皮
  | 'romantic'      // 浪漫

// 說話風格類型
export type SpeakingStyle =
  | 'casual'        // 隨性
  | 'formal'        // 正式
  | 'cute'          // 可愛
  | 'mature'        // 成熟
  | 'direct'        // 直接
  | 'subtle'        // 委婉

// AI分身基本資料介面
export interface AICompanion {
  id: string
  name: string
  avatar: string
  age: number
  gender: Gender
  bio: string             // 個人簡介

  // 個性分析結果
  personality_analysis: {
    dominant_traits: PersonalityTrait[]
    speaking_style: SpeakingStyle
    emotional_patterns: string[]
    humor_style?: string
    interests: string[]
    topics_she_likes: string[]
    topics_to_avoid: string[]
  }

  // 學習狀態
  learning_status: {
    data_completeness: number     // 數據完整度 0-100
    analysis_confidence: number   // 分析可信度 0-100
    last_training: string        // 最後訓練時間
    conversation_samples: number  // 對話樣本數量
    photo_samples: number        // 照片樣本數量
  }

  // 對話統計
  interaction_stats: {
    practice_sessions: number     // 練習次數
    total_messages: number       // 總訊息數
    conversation_quality_score: number  // 對話品質分數
    improvement_trend: 'improving' | 'stable' | 'declining'
  }

  // 語音特性（模擬她的說話方式）
  voice_simulation?: {
    tone: 'sweet' | 'gentle' | 'lively' | 'calm'
    speed: 'slow' | 'normal' | 'fast'
    pitch: 'high' | 'medium' | 'low'
    accent?: string
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

// 對話模擬會話（與AI分身的練習對話）
export interface SimulationSession {
  id: string
  companion_id: string         // AI分身ID
  scenario: ConversationScenario

  // 會話記錄
  messages: SimulationMessage[]

  // 她的模擬狀態
  companion_mood: string       // 她當前的心情
  relationship_temperature: number  // 關係熱度 0-100

  // 用戶表現評估
  performance_metrics: {
    response_speed: number     // 回應速度
    conversation_flow: number  // 對話流暢度
    emotional_intelligence: number  // 情商表現
    topic_relevance: number    // 話題相關性
  }

  // 建議和改進
  suggested_improvements: string[]
  successful_responses: string[]  // 成功的回應範例

  created_at: string
  ended_at?: string
}

// 對話場景
export interface ConversationScenario {
  id: string
  name: string
  description: string
  context: string        // 對話情境（如第一次見面、約會、日常聊天）
  mood: 'casual' | 'romantic' | 'serious' | 'playful'
}

// 模擬對話訊息
export interface SimulationMessage {
  id: string
  sender: 'user' | 'ai_companion'  // AI分身
  content: string
  timestamp: string
  emotion_context?: string  // 她當時的情緒狀態
  response_quality?: number // 回應品質評分
}

// AI分身創建請求
export interface CreateCompanionRequest {
  name: string
  age: number
  bio: string
  photos: File[]
  conversation_records: string[]  // 與她的聊天記錄
  additional_info: {
    interests: string[]
    personality_notes: string
    relationship_status: 'stranger' | 'acquaintance' | 'friend' | 'dating'
    special_memories?: string[]
  }
}

// AI分身創建步驟
export interface CompanionCreationStep {
  step: number
  title: string
  description: string
  completed: boolean
  data?: any
}

// API 回應介面
export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}