/**
 * AI助手詳情頁面 - 獨立路由
 * 顯示助手的詳細信息，不顯示底部Tab欄
 */

import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CompanionProfile } from '@/src/components/screens/CompanionProfile'
import { useCompanionStore } from '@/src/stores/assistantStore'

export default function AssistantDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { companions } = useCompanionStore()

  // 從路由參數獲取助手ID
  const assistantId = params.id as string

  // 根據ID查找助手
  const companion = companions.find(c => c.id === assistantId)

  if (!companion) {
    // 如果找不到助手，返回上一頁
    router.back()
    return null
  }

  const handleBack = () => {
    router.back()
  }

  const handleStartChat = () => {
    router.push({
      pathname: '/conversation-practice',
      params: {
        id: companion.id,
        name: companion.name,
        avatar: companion.avatar,
        gender: companion.gender,
        age: companion.age.toString(),
        bio: companion.bio
      }
    })
  }

  const handleAddData = () => {
    console.log('管理資料按鈕被點擊，準備跳轉到 edit-companion 頁面，助手ID:', companion.id)
    try {
      router.push({
        pathname: '/edit-companion',
        params: { id: companion.id }
      })
    } catch (error) {
      console.error('跳轉失敗:', error)
    }
  }

  const handleEditProfile = () => {
    console.log('編輯檔案按鈕被點擊，準備跳轉到 edit-companion 頁面，助手ID:', companion.id)
    try {
      router.push({
        pathname: '/edit-companion',
        params: { id: companion.id }
      })
    } catch (error) {
      console.error('編輯檔案跳轉失敗:', error)
    }
  }

  const handleViewHistory = () => {
    // TODO: 實現查看歷史功能 - 可能需要創建新的路由
    console.log('查看歷史功能待實現')
  }

  const handleQuickAnalysis = () => {
    console.log('快速分析按鈕被點擊，準備跳轉到 quick-analysis 頁面，助手ID:', companion.id)
    try {
      router.push({
        pathname: '/quick-analysis',
        params: { id: companion.id }
      })
    } catch (error) {
      console.error('快速分析跳轉失敗:', error)
    }
  }

  return (
    <CompanionProfile
      companion={companion}
      onBack={handleBack}
      onStartChat={handleStartChat}
      onAddData={handleAddData}
      onEditProfile={handleEditProfile}
      onViewHistory={handleViewHistory}
      onQuickAnalysis={handleQuickAnalysis}
    />
  )
}