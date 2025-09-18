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
  realAvatar?: string     // 真實頭像 URL (可選)
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

  // 互動統計
  interaction_stats: {
    chat_assistance_sessions: number    // 聊天輔助次數
    total_messages_analyzed: number     // 總分析訊息數
    relationship_insight_score: number  // 關係洞察分數
    assistance_effectiveness: number    // 輔助效果評分
    trend: 'improving' | 'stable' | 'declining'
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

  // 用戶新增的資料
  user_added_data?: {
    photos: string[]                    // 用戶上傳的照片
    conversation_records: string[]      // 用戶提供的對話記錄
    interests: string[]                 // 用戶補充的興趣愛好
    personality_notes: string           // 用戶對她個性的描述
    relationship_status: 'stranger' | 'acquaintance' | 'friend' | 'dating'
    special_memories: string            // 特殊回憶
    last_updated: string               // 最後更新時間
  }
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

// 聊天輔助會話（實戰聊天支援）
export interface ChatAssistanceSession {
  id: string
  companion_id: string         // AI分身ID

  // 真實聊天資料
  uploaded_chat_images: string[] // 聊天截圖
  extracted_messages: SimulationMessage[] // 從截圖提取的對話

  // 當前聊天狀態
  relationship_temperature: number  // 關係熱度 0-100
  her_current_mood: string     // 她當前的情緒狀態
  conversation_topic: string   // 目前話題

  // AI分析結果
  conversation_analysis: {
    engagement_level: number   // 她的參與度 0-100
    interest_indicators: string[] // 興趣信號
    warning_signs: string[]    // 需要注意的信號
    optimal_response_timing: number // 最佳回覆時機（分鐘）
  }

  // 實時建議
  reply_recommendations: ReplyRecommendation[]
  topic_suggestions: string[]

  created_at: string
  last_updated: string
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

// 回覆建議
export interface ReplyRecommendation {
  id: string
  type: 'text' | 'emoji' | 'question' | 'compliment' | 'topic_change' | 'greeting'
  content: string
  reasoning: string           // 為什麼推薦這個回覆
  confidence_score: number   // 信心度 0-100
  estimated_response_rate: number // 預估她會回覆的機率
  tone: 'casual' | 'romantic' | 'humorous' | 'caring' | 'playful'
}

// 關係洞察分析
export interface RelationshipInsight {
  id: string
  companion_id: string

  // 關係狀態
  current_stage: 'strangers' | 'acquaintances' | 'friends' | 'close_friends' | 'romantic_interest' | 'dating'
  relationship_temperature: number // 0-100
  compatibility_score: number      // 相容性評分

  // 互動分析
  interaction_patterns: {
    conversation_frequency: number    // 對話頻率（每週）
    average_response_time: number    // 平均回覆時間（小時）
    message_length_ratio: number     // 訊息長度比例（你的/她的）
    emoji_usage_similarity: number   // 表情符號使用相似度
  }

  // 興趣匹配
  shared_interests: string[]
  conversation_topics: {
    topic: string
    engagement_level: number     // 她對此話題的參與度
    frequency: number           // 討論頻率
  }[]

  // 建議和警示
  relationship_advice: string[]
  potential_concerns: string[]
  next_step_suggestions: string[]

  // 時間追蹤
  analysis_date: string
  trend: 'improving' | 'stable' | 'declining'
}

// 單次快速分析介面
export interface QuickAnalysis {
  id: string
  companion_id: string
  input_type: 'image' | 'text'
  input_data: string // 圖片URL或文字內容
  analysis_result: QuickAnalysisResult
  created_at: string
}

// 快速分析結果
export interface QuickAnalysisResult {
  conversation_context: {
    relationship_stage: 'initial' | 'getting_to_know' | 'developing' | 'established'
    her_mood: string
    engagement_level: number // 0-100
    conversation_topic: string
  }

  insights: {
    interest_indicators: string[]
    warning_signs: string[]
    emotional_state: string
    communication_style: string
  }

  recommendations: {
    reply_suggestions: QuickReplyRecommendation[]
    conversation_strategies: string[]
    timing_advice: string
    topics_to_explore: string[]
    things_to_avoid: string[]
  }

  confidence_score: number // 0-100
}

// 快速回覆建議
export interface QuickReplyRecommendation {
  id: string
  type: 'question' | 'compliment' | 'humorous' | 'caring' | 'topic_change' | 'emoji'
  content: string
  reasoning: string
  confidence_score: number
  expected_response_rate: number // 0-100
  tone: 'casual' | 'romantic' | 'playful' | 'supportive' | 'curious'
}

// 快速分析請求
export interface QuickAnalysisRequest {
  companion_id: string
  input_type: 'image' | 'text' | 'mixed'
  input_data: string | string[] // single or multiple inputs
  images?: string[] // multiple base64 images
  texts?: string[] // multiple text contents
  context?: {
    relationship_stage?: string
    recent_conversation_context?: string
  }
}

// 聊天訊息介面（用於快速分析聊天）
export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  attachments?: {
    images?: string[]
    files?: FileData[]
  }
  analysisResult?: QuickAnalysisResult
  isLoading?: boolean
}

// 檔案資料介面
export interface FileData {
  name: string
  content: string
  type: string
  size: number
}

// 快速追問選項
export interface QuickQuestionOption {
  id: string
  text: string
  category: 'clarification' | 'deeper_analysis' | 'suggestion' | 'alternative'
}

// API 回應介面
export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}