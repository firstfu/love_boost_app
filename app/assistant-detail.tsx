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
    router.push({
      pathname: '/add-data',
      params: { id: companion.id }
    })
  }

  const handleEditProfile = () => {
    // TODO: 實現編輯檔案功能 - 可能需要創建新的路由
    console.log('編輯檔案功能待實現')
  }

  const handleViewHistory = () => {
    // TODO: 實現查看歷史功能 - 可能需要創建新的路由
    console.log('查看歷史功能待實現')
  }

  const handleQuickAnalysis = () => {
    router.push({
      pathname: '/quick-analysis',
      params: { id: companion.id }
    })
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