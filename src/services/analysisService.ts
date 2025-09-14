/**
 * 快速分析服務
 * 提供圖片上傳、文字分析和AI對話分析功能
 */

import * as ImagePicker from 'expo-image-picker'
import {
  QuickAnalysisRequest,
  QuickAnalysisResult,
  APIResponse
} from '../types/assistant'

// 模擬的AI分析服務配置（實際使用時可配置）
// const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || ''
// const ANALYSIS_API_URL = 'https://api.openai.com/v1/chat/completions'

export class AnalysisService {

  /**
   * 選擇單張圖片（相機或相簿）
   */
  static async pickImage(): Promise<ImagePicker.ImagePickerResult> {
    // 請求權限
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      throw new Error('需要相簿權限才能選擇圖片')
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true
    })

    return result
  }

  /**
   * 選擇多張圖片（相簿）
   */
  static async pickMultipleImages(): Promise<ImagePicker.ImagePickerResult> {
    // 請求權限
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      throw new Error('需要相簿權限才能選擇圖片')
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true
    })

    return result
  }

  /**
   * 拍攝照片
   */
  static async takePhoto(): Promise<ImagePicker.ImagePickerResult> {
    // 請求相機權限
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      throw new Error('需要相機權限才能拍攝照片')
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true
    })

    return result
  }

  /**
   * 執行快速分析
   */
  static async performQuickAnalysis(request: QuickAnalysisRequest): Promise<APIResponse<QuickAnalysisResult>> {
    try {
      // 構建分析提示詞
      const analysisPrompt = this.buildAnalysisPrompt(request)

      // 模擬API調用（實際應該調用OpenAI API）
      const analysisResult = await this.callAnalysisAPI(analysisPrompt, request)

      return {
        success: true,
        data: analysisResult,
        message: '分析完成'
      }
    } catch (error) {
      console.error('分析失敗:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '分析過程發生錯誤'
      }
    }
  }

  /**
   * 構建分析提示詞
   */
  private static buildAnalysisPrompt(request: QuickAnalysisRequest): string {
    let contentSection = ''

    if (request.input_type === 'image') {
      const imageCount = Array.isArray(request.input_data) ? request.input_data.length : 1
      contentSection = `請分析這${imageCount > 1 ? `${imageCount}張` : '張'}聊天截圖，理解對話內容和情境：\n\n`

      if (Array.isArray(request.input_data)) {
        request.input_data.forEach((_, index) => {
          contentSection += `圖片 ${index + 1}: [聊天截圖]\n`
        })
      } else {
        contentSection += '[聊天截圖]'
      }
    } else if (request.input_type === 'text') {
      const textCount = Array.isArray(request.input_data) ? request.input_data.length : 1
      contentSection = `請分析以下${textCount > 1 ? `${textCount}段` : ''}對話內容：\n\n`

      if (Array.isArray(request.input_data)) {
        request.input_data.forEach((text, index) => {
          contentSection += `對話 ${index + 1}: ${text}\n\n`
        })
      } else {
        contentSection += request.input_data
      }
    } else if (request.input_type === 'mixed') {
      contentSection = '請分析以下混合內容（圖片和文字）：\n\n'

      if (request.images && request.images.length > 0) {
        contentSection += `圖片內容 (${request.images.length}張):\n`
        request.images.forEach((_, index) => {
          contentSection += `圖片 ${index + 1}: [聊天截圖]\n`
        })
        contentSection += '\n'
      }

      if (request.texts && request.texts.length > 0) {
        contentSection += `文字內容 (${request.texts.length}段):\n`
        request.texts.forEach((text, index) => {
          contentSection += `文字 ${index + 1}: ${text}\n\n`
        })
      }
    }

    return `
你是一個專業的戀愛諮詢助手，擅長分析對話和提供聊天建議。

${contentSection}

請提供以下格式的分析結果（請用繁體中文回答）：

1. 對話情境分析：
   - 關係階段（初期/了解中/發展中/穩定）
   - 她的情緒狀態
   - 參與度評分（0-100）
   - 目前話題

2. 洞察分析：
   - 興趣指標（她展現興趣的信號）
   - 警示信號（需要注意的地方）
   - 情緒狀態描述
   - 溝通風格特點

3. 建議回覆（至少3個）：
   - 回覆內容
   - 推薦理由
   - 預期成功率
   - 語調風格

4. 聊天策略建議
5. 時機建議
6. 可探索話題
7. 需要避免的話題

${request.input_type === 'mixed' || Array.isArray(request.input_data)
  ? '請綜合分析所有提供的內容，提供整體性的建議。'
  : ''}

請確保建議實用且符合台灣本地文化背景。
`
  }

  /**
   * 調用分析API（模擬實現）
   */
  private static async callAnalysisAPI(prompt: string, request: QuickAnalysisRequest): Promise<QuickAnalysisResult> {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 返回模擬分析結果
    return {
      conversation_context: {
        relationship_stage: 'getting_to_know',
        her_mood: '輕鬆愉快，對話題有興趣',
        engagement_level: 78,
        conversation_topic: '興趣愛好分享'
      },

      insights: {
        interest_indicators: [
          '積極回應你的問題',
          '分享個人經歷和想法',
          '使用表情符號表達情感'
        ],
        warning_signs: [
          '回覆略顯簡短，可能需要更有趣的話題'
        ],
        emotional_state: '開放且友善，對深入了解持正面態度',
        communication_style: '直接但溫和，喜歡真實的交流'
      },

      recommendations: {
        reply_suggestions: [
          {
            id: '1',
            type: 'question',
            content: '聽起來很有趣耶！可以跟我分享一下你最喜歡的是什麼部分嗎？',
            reasoning: '表現出對她興趣的關注，邀請她分享更多細節',
            confidence_score: 85,
            expected_response_rate: 80,
            tone: 'curious'
          },
          {
            id: '2',
            type: 'compliment',
            content: '你對這個真的很有見解呢，我從來沒想過這個角度',
            reasoning: '認同她的觀點，讓她感到被重視和理解',
            confidence_score: 75,
            expected_response_rate: 70,
            tone: 'supportive'
          },
          {
            id: '3',
            type: 'humorous',
            content: '哈哈哈我完全懂！我也是那種一開始就會陷進去的人 😂',
            reasoning: '用輕鬆幽默的方式產生共鳴，拉近距離',
            confidence_score: 80,
            expected_response_rate: 85,
            tone: 'playful'
          }
        ],
        conversation_strategies: [
          '持續展現對她興趣的好奇心',
          '適時分享自己相關的經驗',
          '用開放式問題引導更深入的對話'
        ],
        timing_advice: '建議在她回覆後30分鐘內回覆，保持對話節奏',
        topics_to_explore: [
          '深入了解她的興趣愛好',
          '分享彼此的生活經驗',
          '討論共同感興趣的話題'
        ],
        things_to_avoid: [
          '避免過於深入的個人問題',
          '不要急於轉換話題',
          '避免過度分析或說教'
        ]
      },

      confidence_score: 82
    }
  }

  /**
   * 將圖片轉換為base64格式
   */
  static async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri)
      const blob = await response.blob()

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result as string
          resolve(base64data.split(',')[1]) // 移除 data:image/jpeg;base64, 前綴
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch {
      throw new Error('圖片轉換失敗')
    }
  }

  /**
   * 驗證輸入內容
   */
  static validateInput(inputType: 'image' | 'text', inputData: string): boolean {
    if (!inputData || inputData.trim().length === 0) {
      return false
    }

    if (inputType === 'text') {
      return inputData.trim().length >= 5 // 最少5個字符
    }

    if (inputType === 'image') {
      return inputData.startsWith('data:image/') || inputData.includes('base64')
    }

    return false
  }
}