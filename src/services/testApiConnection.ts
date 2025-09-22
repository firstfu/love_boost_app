/**
 * API 連接測試工具
 * 用於測試前後端 API 連接
 */

import { apiClient } from './apiClient'

export const testApiConnection = async () => {
  console.log('=== 測試 API 連接 ===')

  try {
    // 測試健康檢查
    console.log('1. 測試健康檢查...')
    const healthResponse = await apiClient.healthCheck()

    if (healthResponse.success) {
      console.log('✅ 健康檢查成功:', healthResponse.data)
    } else {
      console.error('❌ 健康檢查失敗:', healthResponse.error)
      return false
    }

    // 測試未認證的 API 調用
    console.log('2. 測試未認證的用戶資訊請求 (應該失敗)...')
    const unauthorizedResponse = await apiClient.getCurrentUser()

    if (!unauthorizedResponse.success && unauthorizedResponse.status === 401) {
      console.log('✅ 未認證請求正確拒絕:', unauthorizedResponse.error)
    } else {
      console.warn('⚠️ 未認證請求處理異常:', unauthorizedResponse)
    }

    return true
  } catch (error) {
    console.error('❌ API 連接測試失敗:', error)
    return false
  }
}