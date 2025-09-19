/**
 * 編輯助手頁面 - 獨立路由
 * 提供助手的編輯/管理資料功能
 */

import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { EditCompanion } from '@/src/components/screens/EditCompanion'
import { useCompanionStore } from '@/src/stores/assistantStore'

export default function EditCompanionScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { companions, updateCompanion } = useCompanionStore()

  // 從路由參數獲取助手ID
  const assistantId = params.id as string

  console.log('EditCompanionScreen 已加載，接收到的參數:', params)
  console.log('助手ID:', assistantId)

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

  const handleSave = (updatedCompanion: any) => {
    console.log('儲存更新的助手資料:', updatedCompanion)
    // 更新助手資料
    updateCompanion(updatedCompanion.id, updatedCompanion)
    // 儲存完成後返回上一頁
    router.back()
  }

  return (
    <EditCompanion
      companion={companion}
      onBack={handleBack}
      onSave={handleSave}
    />
  )
}